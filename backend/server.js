const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const app = express();
require('dotenv').config();
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, 
        sameSite: 'none'
    }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

var conn = mongoose.createConnection("mongodb+srv://Yash:"+process.env.MONGOPASSWORD+"@cluster0.djeqndd.mongodb.net/SourceLabUsers?retryWrites=true&w=majority");
var User = conn.model('users', new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        default: "",
    },
    profileUrl: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
    },
    likedProfiles: {
        type: [String],
        default: [],
    },
    likedBy: [
        {
            username: {
                type: String,
                required: true,
            },
            avatarUrl: {
                type: String,
            },
            likedDate: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true }));

app.get("/", (req, res) => {
    res.send("server is ready");
});

app.get("/api/profile/:username", async (req, response) => {
    const { username } = req.params;
    try {
        const res = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                authorization: `token ${process.env.GITHUB_KEY}`,
            },
        });
        const profile = await res.json();
        const repoRes = await fetch(profile.repos_url
            , {
                headers: {
                    authorization: `token ${process.env.GITHUB_KEY}`,
                },
            });
        const rR = await repoRes.json();
        response.status(200).json({ profile, rR });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.get("/api/repos/:language", async (req, response) => {
    try {
        const { language } = req.params;
        console.log(language)
        const res = await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`, {
            headers: {
                authorization: `token ${process.env.GITHUB_KEY}`,
            },
        });
        const data = await res.json();
        response.status(200).json({ repos: data.items });
    }
    catch (err) {
        response.status(500).json({ error: err.message });
    }

});

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT,
            clientSecret: process.env.GITHUB_SECRET,
            callbackURL: "/api/github/callback",
        },
        async function (accessToken, refreshToken, profile, done) {
            const user = await User.findOne({ username: profile.username });
            if (!user) {
                const newUser = new User({
                    name: profile.displayName,
                    username: profile.username,
                    profileUrl: profile.profileUrl,
                    avatarUrl: profile.photos[0].value,
                    likedProfiles: [],
                    likedBy: [],
                });
                await newUser.save();
                done(null, newUser);
            } else {
                done(null, user);
            }
        }
    )
);


app.get("/api/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/api/github/callback", passport.authenticate("github", { failureRedirect: process.env.CLIENT_URL + "/login",successRedirect: process.env.CLIENT_URL  }),);
app.get("/check", (req, res) => { 
    if (req.isAuthenticated()) {
        console.log("aaa")
        res.send({ user: req.user });
    } else {
        res.send({ user: null });
    }
});
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.json({ message: "logged out" });
    });
});
app.get("/like/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findById(req.user._id.toString());
        console.log(user, "auth user");
        const userToLike = await User.findOne({ username });
        if (!userToLike) {
            return res.status(404).json({ error: "User is not a member" });
        }

        if (user.likedProfiles.includes(userToLike.username)) {
            return res.status(400).json({ error: "User already liked" });
        }
        userToLike.likedBy.push({ username: user.username, avatarUrl: user.avatarUrl, likedDate: Date.now() });
        user.likedProfiles.push(userToLike.username);
        await Promise.all([userToLike.save(), user.save()]);

        res.status(200).json({ message: "User liked" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
);
app.get("/likes", async (req, res) => {
    try {
        const user = await User.findById(req.user._id.toString());
        res.status(200).json({ likedBy: user.likedBy });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("server is up");
});