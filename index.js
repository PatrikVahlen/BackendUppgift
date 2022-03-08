const express = require("express");

const router = express.Router();
const { Tweet } = require("./models/tweets");

router.get("/", async (req, res) => {

    if (req.user) {
        const entries = await Tweet
            .find({ user: req.user.following }).sort('-date')
            .populate("user")
            .exec();
        res.render("pages/index.ejs", { entries });
    } else {
        const entries = await Tweet
            .find({}).sort('-date')
            .populate("user")
            .exec();
        res.render("pages/index.ejs", { entries });
    }
});

router.post("/", async (req, res) => {
    if (req.user) {
        const { content } = req.body;
        const user = req.user;
        const entry = new Tweet({ content, user: user._id });
        try {
            await entry.save();
        } catch (error) {
            console.log(error);
        }
        res.redirect("/");
    } else {
        console.log("Not logged in");
        res.redirect("/login")
    }
});

exports.router = router;