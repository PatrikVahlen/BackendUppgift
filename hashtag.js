const express = require("express");

const router = express.Router();
const { Tweet } = require("./models/tweets");

router.get("/:hashId", async (req, res) => {
    let hashtag = "#"+req.params.hashId;
    //console.log(hashtag);
    const entries = await Tweet
        .find({ hashtag: hashtag }).sort('-date')
        .populate("user")
        .exec();
    res.render("pages/hashtags.ejs", { entries })
});

exports.router = router;