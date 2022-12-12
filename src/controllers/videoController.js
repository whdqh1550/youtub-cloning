export const trending = (req, res) => res.render("home", { pageTitle: "Home" }); //this is giving title to top of the page
export const search = (req, res) => res.send("search Videos");
export const see = (req, res) => res.render("watch", { pageTitle: "watch" });
export const remove = (req, res) => {
  console.log(req.params);
  res.send("delete video");
};
export const edit = (req, res) => res.render("edit", { pageTitle: "edit" });
export const upload = (req, res) => res.send("upload");
