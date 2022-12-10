import express from "express";
import { see, remove, edit, upload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id", see);
videoRouter.get("/:id/remove", remove);
videoRouter.get("/:id/edit", edit);

export default videoRouter;
