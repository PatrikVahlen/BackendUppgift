const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');

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
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1/backend11' })
}));

app.use(passport.authenticate("session"));


app.get("/", (req, res) => {
    if (req.user) {
        res.render("index.ejs", { username: req.user.username });
    } else {
        redirect("/login")
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs")
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/"
}));

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username });
    await user.setPassword(password);
    await user.save();
    res.redirect("/login");
});

mongoose.connect("mongodb://127.0.0.1/backend11");

app.listen(PORT, () => {
    console.log(`Started Express server on port ${PORT}`);
});
