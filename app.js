const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const moment = require("moment");

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

    //const entries = await Tweet.find({ user: req.user._id });
    //const entries = await Tweet.find().exec();
    const entries = await Tweet
        .find().sort('-date')
        .populate("user")
        .exec();
    res.render("pages/index.ejs", { entries });
    // res.render("pages/index.ejs", { username: req.user.name, entries });

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
});

app.get("/profile", (req, res) => {
    if (req.user) {
        res.render("pages/profile.ejs", { name: req.user.name, image: req.user });
        // console.log(req.user)
    } else {
        console.log("Not logged in");
        res.redirect("/login")
    }
})

app.get("/:profileId", async (req, res) => {
    const profileId = req.params.profileId;
    const entries = await Tweet
        .find({}).sort('-date')
        .populate("user")
        .exec();
    //console.log(entries);
    // console.log(entries);
    res.render("pages/visitprofile.ejs", { profileId, entries });
})

// app.post(":profileId", async (req, res) => {
//     console.log("profileId")
//     res.redirect("/")
// })

app.post("/signup", async (req, res) => {
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
        console.log(error.errors)
    }
    res.redirect("/login");
});

app.post("/", async (req, res) => {
    const { content } = req.body;
    //console.log(content);
    const user = req.user;
    const entry = new Tweet({ content, user: user._id });
    try {
        await entry.save();
    } catch (error) {
        console.log(error.errors);
    }
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
    // const user = req.user;
    await User.updateOne({ _id: user }, { name: name })
    await User.updateOne({ _id: user }, { img: img })
    res.redirect("/profile");
});

// app.get("/logout", (req, res) => {
//     req.logout();
//     req.session.destroy();
//     res.redirect("/login");
// });

app.get('/user/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});

app.get("/follower/:followId", async (req, res) => {
    const followId = req.params.followId;
    //console.log(profileId);
    const user = req.user._id;
    const user1 = user._id;
    console.log(user);
    console.log(followId);
    console.log("HÄR");
    await User.updateOne({ _id: user }, { $push: { following: followId } })
    await User.updateOne({ _id: followId }, { $push: { followers: user._id } })
    res.redirect("/");
});

// app.put("/user/follow", (req, res) => {
//     User.findByIdAndUpdate(req.body.followId, {
//         $push: { followers: req.user._id }
//     }, {
//         new: true
//     }, (err, result => {
//         User.findByIdAndUpdate(req.user._id, {
//             $push: { following: req.body.followId }
//         }, { new: true }).then(result => {

//         })
//     })
//     )
// });

mongoose.connect("mongodb://127.0.0.1/backendUppgift");

app.listen(PORT, () => {
    console.log(`Started Express server on port ${PORT}`);
});