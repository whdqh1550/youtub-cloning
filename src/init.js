import "./db"; // when a file is import js automatically runs it after this file run.
import "./models/Video";
import app from "./server";

const PORT = 4000;
const handleListening = () => console.log(`✅Server listening on ${PORT}🚀`);
app.listen(PORT, handleListening);
