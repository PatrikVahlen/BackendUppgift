const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const { User } = require("./models/user");
const { Tweet } = require("./models/tweets");

const app = express()
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

//Import CSS
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
    secret: "avsd1234",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1/backendUppgift' })
}));

app.use(passport.authenticate("session"));

//What is this?

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

app.get("/", async (req, res) => {
    if (req.user) {
        //const entries = await Tweet.find({ user: req.user._id });
        //const entries = await Tweet.find().exec();
        const entries = await Tweet
            .find()
            .populate("user")
            .exec();
        res.render("pages/index.ejs", { username: req.user.name, entries });
    } else {
        res.redirect("login")
    }
});

app.get("/login", (req, res) => {
    res.render("pages/login.ejs")
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

app.get("/signup", (req, res) => {
    res.render("pages/signup.ejs");
})

app.get("/profile", (req, res) => {
    res.render("pages/profile.ejs", { name: req.user.name, image: req.user });

})

app.get("/:profileId", async (req, res) => {
    const profileId = req.params.profileId;
    const entries = await Tweet
        .find({})
        .populate("user")
        .exec();
    // console.log(entries);
    // console.log(profileId);
    res.render("pages/visitprofile.ejs", { profileId, entries });
})

app.post(":profileId", async (req, res) => {
    console.log("profileId")
    res.redirect("/")
})

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const name = username;
    const img = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + "bild.jpg")),
        contentType: 'image/png'
    };

    const user = new User({ username, name, img });
    await user.setPassword(password);
    await user.save();
    res.redirect("/login");
});

app.post("/", async (req, res) => {
    const { content } = req.body;
    //console.log(content);
    const user = req.user;
    const entry = new Tweet({ content, user: user._id });
    await entry.save();
    res.redirect("/");
});

app.post("/profile", upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const img = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    };
    console.log(name);
    console.log(__dirname + '/uploads/' + req.file.filename);
    console.log(img);
    const user = req.user;
    await User.updateOne({ _id: user }, { name: name })
    await User.updateOne({ _id: user }, { img: img })
    res.redirect("/profile");
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("./login");
});

mongoose.connect("mongodb://127.0.0.1/backendUppgift");

app.listen(PORT, () => {
    console.log(`Started Express server on port ${PORT}`);
});