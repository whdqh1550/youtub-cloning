import User from "../models/User";
import Video from "../models/Video";

//Video.find({}, (error, videos) => {
//return is inside here to make sure that render after search is done.
//});
export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner"); //await have to be used with async in the function, using await waits for db to answer

  return res.render("home", { pageTitle: "Home", videos: videos }); //this is giving title to top of the page
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner"); //since we have ref as User if you populate it will find User info with the id in owner Obj
  //populate find coordinate owner id in the schen owner obj and bring the user info into video shcem owner section

  return res.render("watch", { pageTitle: video.title, video: video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const {
    user: { _id },
  } = req.session;

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    //this is to check the person is the owner of the video
    return res.status(403).redirect("/");
  }

  return res.render("edit", { pageTitle: `Editing:${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.exists({ _id: id });
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  if (String(video.owner) !== String(_id)) {
    //this is to check the person is the owner of the video
    return res.status(403).redirect("/");
  }
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `Upload Video` });
};
export const postUpload = async (req, res) => {
  const file = req.file;
  const { user: _id } = req.session;
  const { title, description, hashtags } = req.body;

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: file.path,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id, // since it has reference in schema we can only send _id of User who owns it
    });
    // this is way to save vid on db
    // need to put await cause it video.save() returns promise which mean it has to wait to be save

    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save(); //up three lines are for adding video id to owners videos array in schema
    return res.redirect("/");
  } catch (error) {
    return (
      res.status(400).render("upload"),
      { pageTitle: "Upload Video", errorMessage: error._message }
    );
  }
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const {
    user: { _id },
  } = req.session;
  if (String(video.owner) !== String(_id)) {
    //this is to check the person is the owner of the video
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"), //i is to ignore lowercase and upper case also can add carrot and $ at the end with `` to startwith or end with
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
