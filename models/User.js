import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        requires: true,
    },
    password: {
        type: String,
        requires: true,
    },
    roles: [{
        type: String, 
        default: "Employee",
        required: true,
    }],
    active: {
        type: Boolean,
        default: true,
    }
})

export default mongoose.model('User', userSchema);