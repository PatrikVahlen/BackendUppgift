const express = require("express");

const router = express.Router();
const { Tweet } = require("./models/tweets");

router.get("/hashtags", async (req, res) => {
    const entries = await Tweet
        .find({ hashtag: "#TEST" }).sort('-date')
        .populate("user")
        .exec();
    res.render("pages/hashtags.ejs", { entries })
});

exports.router = router;