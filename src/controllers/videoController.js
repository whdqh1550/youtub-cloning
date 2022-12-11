export const trending = (req, res) => res.render("home");
export const search = (req, res) => res.send("search Videos");
export const see = (req, res) => res.render("watch");
export const remove = (req, res) => {
  console.log(req.params);
  res.send("delete video");
};
export const edit = (req, res) => {
  console.log(req.params);
  res.send("edit video ");
};
export const upload = (req, res) => res.send("upload");
