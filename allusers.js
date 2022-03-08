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

// router.post("/allusers", async (req, res) => {
//     if (req.user) {
//         const { content } = req.body;
//         //console.log(content);
//         const user = req.user;
//         const entry = new Tweet({ content, user: user._id });
//         try {
//             await entry.save();
//         } catch (error) {
//             console.log(error);
//         }
//         res.redirect("/allusers");
//     } else {
//         console.log("Not logged in");
//         res.redirect("/login")
//     }
// });

exports.router = router;