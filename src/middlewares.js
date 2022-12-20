import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  //if (req.session.loggedIn) {
  // res.locals.loggedIn = true;
  //same ias res.locals.loggedIn=Boolean(res.session.loggedIn)
  //}
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "wetube";
  res.locals.loggedInUser = req.session.user || {};

  next();
};

export const protectorMiddleware = (req, res, next) => {
  //this is to only logged in people to go to certain url
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};
export const publicOnlyMiddleware = (req, res, next) => {
  //this is to only logged out people to go
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3000000,
  },
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 10000000,
  },
});
