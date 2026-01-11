import mongoose from "mongoose";
const mongooseInstance = mongoose.connection.useDb("CodeDay");



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, validate:{
    validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
    }
  } },
  password: { type: String, required: true },
  leetcode_username: { type: String, required: false },
  codewars_username: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
});

const User = mongooseInstance.model("Users", userSchema);

export default User;
