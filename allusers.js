const express = require("express");

const router = express.Router();
const { Tweet } = require("./models/tweets");


router.get("/allusers", async (req, res) => {

    const entries = await Tweet
        .find().sort('-date')
        .populate("user")
        .exec();
    res.render("pages/allusers.ejs", { entries });


});

exports.router = router;