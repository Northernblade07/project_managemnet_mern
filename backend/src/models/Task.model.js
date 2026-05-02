import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    dueDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);