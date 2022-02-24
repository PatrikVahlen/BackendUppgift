const mongoose = require("mongoose");
//const uniqueValidator = require('mongoose-unique-validator');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

userSchema.plugin(passportLocalMongoose);
//userSchema.plugin(uniqueValidator, { message: 'Username already exists!' });

const Tweet = mongoose.model("Tweet", userSchema);

exports.Tweet = Tweet;