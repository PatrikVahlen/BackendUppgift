const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');


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

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
    secret: "avsd1234",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1/backendUppgift' })
}));

//MIDDLEWARE
//Make public available i.e. CSS
app.use(express.static(__dirname + '/public'));
//Parse form-data to req.body
app.use(express.urlencoded({ extended: true }));

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

app.get("/profile/:profileId", async (req, res) => {
    const profileId = req.params.profileId;
    const entries = await Tweet
        .find({ user: profileId }).sort('-date')
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