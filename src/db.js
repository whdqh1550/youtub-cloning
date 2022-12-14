import mongoose from "mongoose";

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/wetube");
//{useNewUrlParser: true,   useUnifiedTopology: true,}

const handleError = (error) => console.log("❌DB Error", error);
const handleOpen = () => console.log("✅connected to DB");
const db = mongoose.connection;

db.on("error", handleError); //check on and on
db.once("open", handleOpen); //check once
//can be done with mongoose.on()
