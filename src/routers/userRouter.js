import express from "express";
import { edit, remove } from "../controllers/userController";

const userRouter = express.Router();

const controlEdit = (req, res) => res.send("Edit User");
const controlDelete = (req, res) => res.send("Delete User");

userRouter.get("/edit", edit);
userRouter.get("/remove", remove);

export default userRouter;
