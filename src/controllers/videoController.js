import Video from "../models/Video";

//Video.find({}, (error, videos) => {
//return is inside here to make sure that render after search is done.
//});
export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }); //await have to be used with async in the function, using await waits for db to answer

  return res.render("home", { pageTitle: "Home", videos: videos }); //this is giving title to top of the page
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  return res.render("watch", { pageTitle: video.title, video: video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  return res.render("edit", { pageTitle: `Editing:${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.exists({ _id: id });
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `Upload Video` });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;

  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    // this is way to save vid on db
    // need to put await cause it video.save() returns promise which mean it has to wait to be save
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
