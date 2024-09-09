import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        required: true,
        unique: true,
        type: String,
    },
    picture:{
        type: String,
    },
    name: {
        required: true,
        type: String
    },
    password: {
        required: false,
        type: String
    },
    authSource: {
        type: String,
        enum: ["self", "google"],
        default: "self"
    },
    addresses: { type: [Schema.Types.Mixed] }, 
});

const User = mongoose.model("User", userSchema);

export default User;
