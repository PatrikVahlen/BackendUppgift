const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    content: { type: String, required: true, maxLength: 32 },
    date: { type: Date, default: Date.now }
});

const Tweet = mongoose.model("Tweet", tweetSchema);

exports.Tweet = Tweet;