const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    name: { type: String, required: true },
});

const Profile = mongoose.model("Profile", profileSchema);

exports.Profile = Profile;