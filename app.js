const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const multer = require("multer");

const { User } = require("./models/user");

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


app.get("/", (req, res) => {
    if (req.user) {
        res.render("pages/index.ejs", { username: req.user.username });
    } else {
        res.redirect("login")
    }
});

app.get("/login", (req, res) => {
    res.render("pages/login.ejs")
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/"
}));

app.get("/signup", (req, res) => {
    res.render("pages/signup.ejs");
})

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username });
    await user.setPassword(password);
    await user.save();
    res.redirect("/login");
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("./login");
});

mongoose.connect("mongodb://127.0.0.1/backedUppgift");

app.listen(PORT, () => {
    console.log(`Started Express server on port ${PORT}`);
});