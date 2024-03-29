import express from "express";
import {
  watch,
  remove,
  getEdit,
  postEdit,
  upload,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

//if you put variables on top of normal text the requst goes to variable without checking if it is id or plain text

videoRouter.get("/:id([0-9a-f]{24})", watch); // (\\d+)regex to for id to take only numbers, it has double \\ cause one is for excape

videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload); // in the singele() has to have html name in it

export default videoRouter;
