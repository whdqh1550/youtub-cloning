import express from "express";
import { watch, remove, edit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/remove", remove);
videoRouter.get("/edit", edit);
export default videoRouter;
