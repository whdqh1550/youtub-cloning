export const localsMiddleware = (req, res, next) => {
  //if (req.session.loggedIn) {
  // res.locals.loggedIn = true;
  //same ias res.locals.loggedIn=Boolean(res.session.loggedIn)
  //}
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "wetube";
  res.locals.loggedInUser = req.session.user;

  next();
};
