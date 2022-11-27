//package.json can be created by //this folder can be created by putting npm init
import express from "express"; // this only can be done because we have babel if we dont have should be const express = require("express");

const app = express();

const PORT = 4000;

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not allowed </h1>");
  }
  console.log("you may continue");
  next();
};

const handleHome = (req, res) => {
  return res.send("<h1>I still love you</h1>");
}; // this is function after this function is ran by app.get, it doesnt send back the response thats why the browser is keep waiting

const handleLogin = (req, res) => {
  return res.send("login here");
};
const handleProtected = (req, res) => {
  return res.send("Welcome to the private lounge");
};

app.use(logger); // this is to create global midware, can be used in everywhere it is being used everytime the get happens
app.use(privateMiddleware);

app.get("/", handleHome); //this means when somebody sending get request to root(/) page  then we are going to run a function after browser get this, browser send back request
app.get("/login", handleLogin);
app.get("/protected", handleProtected);

const handleListening = () => console.log(`✅Server listening on ${PORT}🚀`);

app.listen(PORT, handleListening);
