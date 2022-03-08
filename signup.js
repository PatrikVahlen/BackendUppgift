const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { User } = require("./models/user");


router.get("/signup", (req, res) => {
    res.render("pages/signup.ejs");
});

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const name = username;
    const img = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + "bild.jpg")),
        contentType: 'image/png'
    };
    const user = new User({ username, name, img });
    await user.setPassword(password);
    try {
        await user.save();
    } catch (error) {
        console.log(error.err)
    }
    res.redirect("/login");
});

exports.router = router;