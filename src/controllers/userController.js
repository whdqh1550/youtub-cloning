import User from "../models/User";
import fetch from "node-fetch"; // in order to user fetcn gotta npm i node-fetch@2.6.1 or can use cross-fetch
import bcrypt from "bcrypt";
import Video from "../models/Video";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Confirm password and password does not match",
    });
  }
  const Exist = await User.exists({ $or: [{ username }, { email }] }); // or can be specifir with making multiple same exist function
  if (Exist) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This user name or email is already taken.",
    });
  }

  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "User name does not exist",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Password does not match",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user; //this is passing the user information into cookie when logged in

  return res.status(200).redirect("/");
};
export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString(); // this is way to stringify into url form of configuration above
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await //this fetching is requesting token from github
  (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json(); //this is putting the result of the fetch into json right away so doesnt have to do code below
  //const json = await data.json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com/";
    const userData = await //this is getting public user information
    (
      await fetch(`${apiUrl}user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await //this is getting email data
    (
      await fetch(`${apiUrl}user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });

    if (!user) {
      console.log(userData.avatarUrl);
      user = await User.create({
        avatarUrl: userData.avatarUrl,
        name: userData.name,
        email: emailObj.email,
        username: userData.login,
        password: "",
        location: userData.location,
        socialOnly: true,
      });
    }
    //create account

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req; // this line is same as const id = req.session.user.id//const { name, email, username, location } = req.body;
  console.log(file);
  if (req.session.user.email !== email) {
    const emailExist = Boolean(await User.findOne({ email }));
    if (emailExist) {
      return res.render("edit-profile", {
        pageTitle: "Edit",
        errorMessage: "Email alrady exsit",
      });
    }
  }
  if (req.session.user.username !== username) {
    const emailExist = Boolean(await User.findOne({ username }));
    if (emailExist) {
      return res.render("edit-profile", {
        pageTitle: "Edit",
        errorMessage: "username alrady exsit",
      });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name: name,
      email: email,
      username: username,
      location: location,
    },
    { new: true } //this one has to be in by default it is false, if it is false it doesnt put updated version to variable, so it has to be new to store new information
  );
  req.session.user = updatedUser;
  //  ...req.session.user, // this is putting previous information into req.session.user thats not going to be infomred by contents underneath

  return res.redirect("/user/edit");
};
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  //we will change password
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, confirmationPassword },
  } = req;
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "the current password does not match",
    });
  }
  if (newPassword !== confirmationPassword) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "the new passwords does not match",
    });
  }
  // in order to trigger pre("save") middleware in User schema we have to use write down the whole schema again like User.create()or user.save()
  const user = await User.findById({ _id });
  user.password = newPassword;
  console.log(user.password);
  await user.save();
  req.session.user.password = user.password; // this is updating the session user obj password bc we have 2 storage which is session and db.
  console.log(user.password);
  return res.redirect("/");
};
export const remove = (req, res) => res.send("remove");
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos"); //transferring all obj id in videos array to video obj
  console.log(user);
  if (!user) {
    res.status(404).render("404");
  }
  //const videos = await Video.find({ owner: user._id }); //this is finding all the videos that has same owner _id
  return res.render("profile", {
    pageTitle: `${user.name} Profile`,
    user,
  });
};
