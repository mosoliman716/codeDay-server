import mongoose from "mongoose";
const mongooseInstance = mongoose.connection.useDb("CodeDay");

const projectSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String , required: true},
    description: {type: String , required: true},
    technologies: {type: [String], required: true},
    status: {type: String, required: true},
    githubUrl: {type: String},
    demoUrl: {type: String},
})

const Project = mongooseInstance.model("projects", projectSchema);

export default Project;