import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  discription: {
    type: String,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  todoType: {
    type: String,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
  },
  isImportent: {
    type: Boolean,
    default: false,
  },
  isUrgent: {
    type: Boolean,
    default: false,
  },
  completionDate: {
    type: Date,
    required: true,
  },
});

const users = mongoose.model("User", todoSchema);

export default users;
