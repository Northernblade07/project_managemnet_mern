// controllers/task.controller.js
import Task from "../models/Task.model.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, message: "Task created", data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    let query = {};
    
    // DASHBOARD LOGIC: 
    // If the user is a member, ONLY fetch tasks assigned to them.
    // If the user is an admin, the query remains empty {}, fetching ALL tasks.
    if (req.user.role === "member") {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "fullName email profilePic") // Only fetch needed user fields
      .populate("project", "name");

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    console.log(req.params.id);
    const task = await Task.findById(req.params.id);

    console.log(task)
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // ROLE SECURITY: Members can only update THEIR OWN tasks
    if (req.user.role === "member" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only update tasks assigned to you" });
    }

    // We only update the status, preventing members from changing titles or assignments
    task.status = req.body.status || task.status;
    await task.save();

    res.status(200).json({ success: true, message: "Task status updated", data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
};