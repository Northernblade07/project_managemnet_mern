import ProjectModel from "../models/project.model.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";

export const createProject = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name required" });
    }

    // Validate members exist
    const validMembers = await User.find({
      _id: { $in: members },
    });

    const project = await Project.create({
      name,
      members: validMembers.map((u) => u._id),
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find().populate("members");
    } else {
      projects = await Project.find({
        members: req.user._id,
      }).populate("members");
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};