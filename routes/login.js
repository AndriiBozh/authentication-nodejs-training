const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/", (req, res) => {
  // we get req.query from 'registration.js'
  const { email, category, text } = req.query;
  //   we are passing this 'message' object to 'login.hbs'
  const message = { category, text };
  // if we get to login page from 'registration' page, render login.hbs with email field populated with email, user entered during registration ==> in this way the user won't have to enter their email on login page
  if (email) {
    return res.render("login", { email, message });
  }
  res.render("login");
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    const username = req.user.name;
    req.flash("success", "You are logged in");
    res.render("loggedin", { username });
  }
);

module.exports = router;
