import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
    } catch (err) {
        console.log(err);
    }
}

export default connectDB;