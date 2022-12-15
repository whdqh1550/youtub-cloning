import Video from "../models/Video";

//Video.find({}, (error, videos) => {
//return is inside here to make sure that render after search is done.
//});
export const home = async (req, res) => {
  const videos = await Video.find({}); //await have to be used with async in the function, using await waits for db to answer
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos: videos }); //this is giving title to top of the page
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  console.log(video);
  return res.render("watch", { pageTitle: video.title, video: video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }

  return res.render("edit", { pageTitle: `Editing:${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  video.title = title;
  video.description = description;
  video.hashtags = hashtags
    .split(",")
    .map((word) => (word.startsWith(`#`) ? word : `#${word}`));
  await video.save();

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
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    // this is way to save vid on db
    // need to put await cause it video.save() returns promise which mean it has to wait to be save
    return res.redirect("/");
  } catch (error) {
    return (
      res.render("upload"),
      { pageTitle: "Upload Video", errorMessage: error._message }
    );
  }
};
