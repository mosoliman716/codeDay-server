import Project from "../models/project.js";

const addProject = async (req, res) => {
     const { title, status, description, technologies, githubUrl, demoUrl } = req.body;
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
         demoUrl
       });

       await newProject.save();
       res.status(201).json(newProject);
     } catch (err) {
       res.status(500).json({ message: err.message });
     }
}

const getProjects = async (req, res) => {
    const userId = req.userId;
     try{
        if (!userId) {
         return res.status(401).json({ message: "Unauthorized" });
       }
       const projects = await Project.find({user_id: userId});
       res.status(201).json(projects);
     } catch(err){
       res.status(500).json({ message: err.message });
     }
}

export { addProject, getProjects };