import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
}); //this is to define the sahpe of data

const Video = mongoose.model("Video", videoSchema);
export default Video;