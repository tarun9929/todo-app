import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username must be unique"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "account with this email already exists"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  todos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "todos",
  },
});

const users = mongoose.model("User", userSchema);

export default users;
