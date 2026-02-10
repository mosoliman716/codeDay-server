import mongoose from "mongoose";
const mongooseInstance = mongoose.connection.useDb("CodeDay");

const certificateSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    title: {type: String , required: true},
    category: {type: String , required: true},
    provider: {type: String , required: true},
    issueDate: {type: String , required: true},
    url: {type: String }
})

const Certificate = mongooseInstance.model("certificates", certificateSchema);

export default Certificate;