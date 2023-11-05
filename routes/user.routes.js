const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {
 // implement a logic, so that user can create account with google account and user data will be save in our data base, like email, name, and passowrd or anything else for verification
})

userRouter.post("/login", (req, res) => {
 // implement a logic so that user can login with google account
})
module.exports = {
    userRouter
};