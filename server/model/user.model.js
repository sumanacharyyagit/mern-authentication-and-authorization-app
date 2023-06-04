import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        username: {
            type: String,
            require: [true, "Please provide the username"],
            unique: [true, "Please provide the unique username"],
        },
        password: {
            type: String,
            require: [true, "Please provide the password"],
            select: false,
        },
        email: {
            type: String,
            require: [true, "Please provide the email"],
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        mobile: {
            type: Number,
        },
        address: {
            type: String,
        },
        profile: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default model.Users || model("User", UserSchema);
