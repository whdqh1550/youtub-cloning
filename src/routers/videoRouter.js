import express from "express";
import { see, remove, edit, upload } from "../controllers/videoController";

const videoRouter = express.Router();

//if you put variables on top of normal text the requst goes to variable without checking if it is id or plain text

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see); // (\\d+)regex to for id to take only numbers, it has double \\ cause one is for excape
videoRouter.get("/:id/remove", remove);
videoRouter.get("/:id/edit", edit);

export default videoRouter;
