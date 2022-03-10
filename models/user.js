const mongoose = require("mongoose");
//const uniqueValidator = require('mongoose-unique-validator');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String, unique: false, required: false },
    lastname: { type: String, unique: false, required: false },
    img: { data: Buffer, contentType: String },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    email: { type: String, unique: false, required: false }
});

userSchema.plugin(passportLocalMongoose);
//userSchema.plugin(uniqueValidator, { message: 'Username already exists!' });

const User = mongoose.model("User", userSchema);

exports.User = User;