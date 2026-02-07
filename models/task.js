import mongoose from "mongoose";
const mongooseInstance = mongoose.connection.useDb("CodeDay");

const TaskSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String , required: true},
    priority: {type: String, required: true},
    status: {type: String, required: true},
    dueDate: {type: Date},
})

const Task = mongooseInstance.model("tasks", TaskSchema);

export default Task;