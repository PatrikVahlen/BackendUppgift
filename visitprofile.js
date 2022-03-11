const express = require("express");

const router = express.Router();
const { Tweet } = require("./models/tweets");

router.get("/profile/:profileId", async (req, res) => {
    const profileId = req.params.profileId;
    const entries = await Tweet
        .find({ user: profileId }).sort('-date')
        .populate("user")
        .exec();
    res.render("pages/visitprofile.ejs", { profileId, entries });
});

exports.router = router;