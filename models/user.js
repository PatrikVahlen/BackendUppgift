const mongoose = require("mongoose");
//const uniqueValidator = require('mongoose-unique-validator');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true }
});

userSchema.plugin(passportLocalMongoose);
//userSchema.plugin(uniqueValidator, { message: 'Username already exists!' });

const User = mongoose.model("User", userSchema);

exports.User = User;