import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  socialOnly: { type: Boolean, default: false },
  username: { type: String, unique: true }, //required: true,
  password: { type: String, unique: true }, //required: false,
  name: { type: String }, //required: true
  location: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    //this is to prevent hashing the password again after push a video to owner and save thea array
    this.password = await bcrypt.hash(this.password, 5);
  }
}); // hashing middleware

const User = mongoose.model(`User`, userSchema);

export default User;
