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

const allusersRouter = require("./allusers").router;
const indexRouter = require("./index").router;
const followRouter = require("./follow").router;
const unfollowRouter = require("./unfollow").router;
const signupRouter = require("./signup").router;
const profileRouter = require("./profile").router;

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

app.use("/", allusersRouter);
app.use("/", indexRouter);
app.use("/", followRouter);
app.use("/", unfollowRouter);
app.use("/", signupRouter);
app.use("/", profileRouter);

app.get("/login", (req, res) => {
    res.render("pages/login.ejs")
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

app.get("/:profileId", async (req, res) => {
    const profileId = req.params.profileId;
    const entries = await Tweet
        .find({}).sort('-date')
        .populate("user")
        .exec();
    res.render("pages/visitprofile.ejs", { profileId, entries });
});

app.get('/user/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

mongoose.connect("mongodb://127.0.0.1/backendUppgift");

app.listen(PORT, () => {
    console.log(`Started Express server on port ${PORT}`);
});