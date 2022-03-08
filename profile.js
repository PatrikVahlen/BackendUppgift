const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const { User } = require("./models/user");

const upload = multer({ dest: 'uploads/' });

router.get("/profile", (req, res) => {
    if (req.user) {
        res.render("pages/profile.ejs", { name: req.user.name, image: req.user });
        // console.log(req.user)
    } else {
        console.log("Not logged in");
        res.redirect("/login")
    }
});

router.post("/profile", upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const img = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    };
    const user = req.user;
    await User.updateOne({ _id: user }, { name: name })
    await User.updateOne({ _id: user }, { img: img })
    res.redirect("/profile");
});


exports.router = router;