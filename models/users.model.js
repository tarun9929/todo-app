import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
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
      minlength: [6, "password must contain 6 letters"],
      select: false,
    },
    is2FaActive: {
      type: Boolean,
      default: false,
    },
    refreshTokens: [String],
    todos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "todos",
    },
  },
  { timestamps: true }
);

const users = mongoose.model("User", userSchema);

export default users;
