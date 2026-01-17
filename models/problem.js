import mongoose from "mongoose";
const mongooseInstance = mongoose.connection.useDb("CodeDay");

const problemSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String , required: true},
    platform: {type: String , required: true, default: "Manual"},
    status: {type: String , required: true},
    difficulty: {type: String , required: true},
    problem_url: {type: String},
})

const Problem = mongooseInstance.model("problems", problemSchema);

export default Problem;