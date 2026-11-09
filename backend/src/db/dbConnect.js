import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectToDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL?.trim();

        if (!mongoUrl) {
            throw new Error("MONGODB_URL is not configured. Add it to the .env file.");
        }

        const connectionInstance = await mongoose.connect(
            `${mongoUrl.replace(/\/+$/, "")}/${DB_NAME}`,
        );
        console.log(`\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection FAILED:", error);
        process.exit(1);
    }
};

export default connectToDB;