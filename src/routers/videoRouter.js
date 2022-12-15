import express from "express";
import {
  watch,
  remove,
  getEdit,
  postEdit,
  upload,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

//if you put variables on top of normal text the requst goes to variable without checking if it is id or plain text

videoRouter.get("/:id([0-9a-f]{24})", watch); // (\\d+)regex to for id to take only numbers, it has double \\ cause one is for excape

videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);

videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
