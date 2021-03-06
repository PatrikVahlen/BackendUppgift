const express = require("express");

const router = express.Router();
const { Tweet } = require("./models/tweets");

//If logged in print only follow tweets else print all tweets

router.get("/", async (req, res) => {
    let welcomeName = "";
    if (req.user) {
        welcomeName = req.user.name;
        const entries = await Tweet
            .find({ user: req.user.following }).sort('-date')
            .populate("user")
            .exec();
        res.render("pages/index.ejs", { entries, welcomeName });
    } else {
        const entries = await Tweet
            .find({}).sort('-date')
            .populate("user")
            .exec();
        res.render("pages/index.ejs", { entries, welcomeName });
    }
});

//Save tweets if logged in and catch hashtags and save the tags

router.post("/", async (req, res) => {
    if (req.user) {
        const { content } = req.body;
        //Look for word starting (^|\B) with # and after add \p{L} i.e. all character (å,ä,ö) 
        //and then number 0-9 /i to recognize case sensitive i.e [a-zA-z], /g look in whole string, /u special chars
        const regex = /(^|\B)#[\p{L}0-9]*/igu;
        const hashtag = content.match(regex)
        console.log(hashtag);
        const user = req.user;
        const entry = new Tweet({ content, user: user._id, hashtag: hashtag });
        try {
            await entry.save();
        } catch (error) {
            //console.log(error);
            console.log("Tweet exceeds 140 chars")
        }
        res.redirect("/");
    } else {
        console.log("Not logged in");
        res.redirect("/login")
    }
});

exports.router = router;