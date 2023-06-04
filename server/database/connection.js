import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

mongoose.set("strictQuery", true);

async function connect() {
    // const mongod = new MongoMemoryServer.create();
    // const getUri = mongod.getUri();

    // const mongod = new MongoMemoryServer();
    // await mongod.start();
    // const getUri = mongod.getUri();
    const getUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/otp-auth-app";

    const db = await mongoose.connect(getUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Database Connected!");
    return db;
}

export default connect;
