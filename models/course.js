import mongoose from "mongoose";
const mongooseInstance = mongoose.connection.useDb("CodeDay");

const courseSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String , required: true},
    category: {type: String , required: true},
    status: {type: String , required: true},
    platform: {type: String , required: true},
    progress: {type: Number, default: 0}
})

const Course = mongooseInstance.model("courses", courseSchema);

export default Course;