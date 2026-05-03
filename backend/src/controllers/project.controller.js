import Project from "../models/Project.model.js";

export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      members: req.body.members, // Ensure frontend sends an array of User IDs
      createdBy: req.user._id,   // Extracted from your protectRoute middleware
    });

    res.status(201).json({ 
      success: true, 
      message: "Project created successfully",
      data: project 
    });
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Internal server error" 
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    // Populate replaces the raw ObjectIds with actual user data (name, email)
    // We pass "-password" to ensure we don't accidentally send password hashes to the frontend
    const projects = await Project.find()
      .populate("members", "-password")
      .populate("createdBy", "-password"); 
      
    res.status(200).json({ 
      success: true, 
      data: projects 
    });
  } catch (err) {
    console.error("Get Projects Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch projects" 
    });
  }
};