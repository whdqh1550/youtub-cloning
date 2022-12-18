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
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
}); // hashing middleware

const User = mongoose.model(`User`, userSchema);

export default User;
