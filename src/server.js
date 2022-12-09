//package.json can be created by //this folder can be created by putting npm init
import express from "express"; // this only can be done because we have babel if we dont have should be const express = require("express");
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");
app.use(logger);

const PORT = 4000;

//this is how to create router

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);

//app.use(logger); // this is to create global midware, can be used in everywhere it is being used everytime the get happens
//app.use(privateMiddleware);

//this means when somebody sending get request to root(/) page  then we are going to run a function after browser get this, browser send back request

const handleListening = () => console.log(`✅Server listening on ${PORT}🚀`);

app.listen(PORT, handleListening);
