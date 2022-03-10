const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const { User } = require("./models/user");

const upload = multer({ dest: 'uploads/' });

router.get("/profile", (req, res) => {
    if (req.user) {
        res.render("pages/profile.ejs", {
            name: req.user.name,
            image: req.user,
            username: req.user.username,
            email: req.user.email,
            lastname: req.user.lastname
        });
    } else {
        console.log("Not logged in");
        res.redirect("/login")
    }
});

router.post("/profile", upload.single('image'), async (req, res) => {
    const { name, lastname, email } = req.body;
    const img = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    };
    console.log(lastname);
    const user = req.user;
    await User.updateOne({ _id: user }, { name: name })
    await User.updateOne({ _id: user }, { lastname: lastname })
    await User.updateOne({ _id: user }, { img: img })
    await User.updateOne({ _id: user }, { email: email })
    res.redirect("/profile");
});


exports.router = router;