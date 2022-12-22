//package.json can be created by //this folder can be created by putting npm init
import express from "express"; // this only can be done because we have babel if we dont have should be const express = require("express");

import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); // setting pug as engine for view
app.set("views", process.cwd() + "/src/views"); // this is how to fix failed to look up view "home"
// this needs to be done because process.cwd() is wetube not src/views file, you have to bring out the view files or set the views
app.use(express.urlencoded({ extended: true })); // this is needed before routers, this makes to understand the body of form.
//url encoded true makes possible to send post with title. It translate HTML into JS form so JS controller understands it
app.use(logger);

//this is how to create router

app.use(
  //this is session middleware this is to make cookie
  session({
    secret: process.env.COOKIE_SECRET, //process.env only works when you install dotevn in npm
    resave: false,
    saveUninitialized: false, //if the modificaion is not initialized it does not give cookies, in this case we only have to logged in person have modifed session
    cookie: {
      maxAge: 2000000, //this is how to set expiration duration in miliseconds
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }), //this is to save sessions on db
  })
);

app.use(localsMiddleware); //this is saving logged in info into session`s cookie
app.use("/", rootRouter);
app.use("/uploads", express.static("uploads")); // this is to expose uploads file to browser so it can look at uploads folder.
app.use("/assets", express.static("assets"));
app.use("/videos", videoRouter);
app.use("/user", userRouter);

//app.use(logger); // this is to create global midware, can be used in everywhere it is being used everytime the get happens
//app.use(privateMiddleware);

//this means when somebody sending get request to root(/) page  then we are going to run a function after browser get this, browser send back request
export default app;
