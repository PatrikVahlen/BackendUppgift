const express = require("express");

const router = express.Router();
const { Tweet } = require("./models/tweets");

router.get("/hashtags/hashtags", async (req, res) => {
    console.log(req.params.hashId);
    const entries = await Tweet
        .find({ hashtag: "#TEST" }).sort('-date')
        .populate("user")
        .exec();
    res.render("pages/hashtags.ejs", { entries })
});

exports.router = router;