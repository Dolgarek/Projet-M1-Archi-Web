import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();

export class Mongodb {
    static async open() {
        if (Mongodb.client == null) {
            try {
                const uri = process.env.MONGO_URI;
                Mongodb.client = await mongoose.connect(uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                console.log("Connected to Mongo DB");
            } catch (err) {
                console.error(err);
                console.error("Exit application...");
                process.exit(-1);
            }
        }
        return Mongodb.client;
    }
}