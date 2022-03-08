const express = require("express");

const { User } = require("./models/user");
const router = express.Router();

router.get("/unfollow/:followId", async (req, res) => {

    if (req.user) {
        const followId = req.params.followId;
        const user = req.user._id;

        let duplicateFollower = await User.findOne({ _id: user, following: followId });

        if (followId == user) {
            console.log("Can't unfollow youself")
        } else if (duplicateFollower == null) {
            console.log("Not following user")
        } else {
            await User.updateOne({ _id: user }, { $pull: { following: followId } })
            await User.updateOne({ _id: followId }, { $pull: { followers: user._id } })
        }
        res.redirect("/");
    } else {
        console.log("Not logged in")
        res.redirect("/login");
    }
});

exports.router = router;