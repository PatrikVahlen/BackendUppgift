const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const multer = require("multer");
//const bootstrap = require("bootstrap");

const { User } = require("./models/user");
const { Tweet } = require("./models/tweets");
const { Profile } = require("./models/profile");

const app = express()
const PORT = 3000;

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


app.get("/", async (req, res) => {
    if (req.user) {
        // console.log(req.user._id);
        //const entries = await Tweet.find({ user: req.user._id });
        const entries = await Tweet.find().exec();
        const tweet = await Tweet
            .findOne({ user: "62179436d51b45608ff6b9c1" })
            .populate("user")
            .exec();
        // console.log(entries);
        console.log(tweet);
        console.log(tweet.user.username);
        console.log(tweet.content);
        console.log(req.user.username);
        // console.log(entries);
        //console.log(req.user._id);
        res.render("pages/index.ejs", { username: req.user.username, entries, tweet });
        // res.render("pages/index.ejs", { entries });
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
    res.render("pages/profile.ejs", { name: req.user.name });
})

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const name = username;
    const user = new User({ username, name });
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

// app.post("/profile", async (req, res) => {
//     const { name } = req.body;
//     console.log(name);
//     const user = req.user;
//     console.log(user);
//     const entry = new Profile({ name, user: user._id });
//     await entry.save();
//     res.redirect("/profile");
// });

app.post("/profile", async (req, res) => {
    const { name } = req.body;
    // console.log(name);
    const user = req.user;
    await User.updateOne({ _id: user }, { name: name })
    res.redirect("/profile");
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("./login");
});


console.log(Tweet.findOne({ user: "62179436d51b45608ff6b9c1" }).populate("user").exec());




mongoose.connect("mongodb://127.0.0.1/backendUppgift");

app.listen(PORT, () => {
    console.log(`Started Express server on port ${PORT}`);
});