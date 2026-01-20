import Project from "../models/project.js";

const addProject = async (req, res) => {
  const { title, status, description, technologies, githubUrl, demoUrl } =
    req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newProject = new Project({
      user_id: userId,
      title,
      status,
      description,
      technologies,
      githubUrl,
      demoUrl,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjects = async (req, res) => {
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const projects = await Project.find({ user_id: userId });
    res.status(201).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editProject = async (req, res) => {
  const {
    _id: projectId,
    title,
    status,
    description,
    technologies,
    githubUrl,
    demoUrl,
  } = req.body;
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const project = await Project.findOne({ _id: projectId, user_id: userId });
    if (!project) {
      console.log("Project not found for editing:", projectId, userId);
      return res.status(404).json({ message: "Project not found" });
    }
    project.title = title || project.title;
    project.status = status || project.status;
    project.description = description || project.description;
    project.technologies = technologies || project.technologies;
    project.githubUrl = githubUrl || project.githubUrl;
    project.demoUrl = demoUrl || project.demoUrl;

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  const { _id: projectId } = req.body;
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await Project.findOneAndDelete({
      _id: projectId,
      user_id: userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { addProject, getProjects, editProject, deleteProject };
