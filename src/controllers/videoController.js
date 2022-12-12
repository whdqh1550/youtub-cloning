export const trending = (req, res) => {
  const videos = [
    {
      title: "Hello",
      rating: 5,
      comment: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "Hello2",
      rating: 5,
      comment: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 2,
    },
    {
      title: "Hello3",
      rating: 5,
      comment: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 3,
    },
  ];
  res.render("home", { pageTitle: "Home", videos }); //this is giving title to top of the page
};
export const search = (req, res) => res.send("search Videos");
export const see = (req, res) => res.render("watch", { pageTitle: "watch" });
export const remove = (req, res) => {
  console.log(req.params);
  res.send("delete video");
};
export const edit = (req, res) => res.render("edit", { pageTitle: "edit" });
export const upload = (req, res) => res.send("upload");
