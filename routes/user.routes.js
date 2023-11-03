 const express = require("express");
const passport = require("passport");
require('dotenv').config()
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();
userRouter.use(passport.initialize());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.clientIdData,
            clientSecret: process.env.clientSecreateKey,
            callbackURL: "/auth/google/callback",
        },
        async (profile, done) => {
            const existingUser = await UserModel.findOne({ email: profile._json.email });

            if (existingUser) {
                const token = jwt.sign({ username: existingUser.name, userID: existingUser._id }, "masai", { expiresIn: "1h" });
                return done(null, { user: existingUser, token });
            } else {
                const newUser = new UserModel({
                    name: profile._json.name,
                    email: profile._json.email,
                });

                // Save the new user to your database.
                await newUser.save();

                // Issue a JWT token for the new user.
                const token = jwt.sign({ username: newUser.name, userID: newUser._id }, "masai", { expiresIn: "1h" });
                return done(null, { user: newUser, token });
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, { id: user.user._id, token: user.token });
});

passport.deserializeUser(async (user, done) => {
    const foundUser = await UserModel.findById(user.id);
    done(null, { user: foundUser, token: user.token });
});

userRouter.get(
    "/auth/google",
    passport.authenticate("GoogleStrategy", {
        scope: ["profile", "email"],
    })
);

userRouter.get(
    "/auth/google/callback",
    passport.authenticate("GoogleStrategy", {
        successRedirect: "/notes",
        failureRedirect: "/",
    }),
    (req, res) => {
        const { user, token } = req.user;
        res.status(200).json({ "msg": "Login successful!", "token": token });
    }
);

module.exports = {
    userRouter
};