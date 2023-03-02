const express = require("express");
const querystring = require("querystring");

const router = express.Router();

const User = require("../models/user");

router.get("/", (req, res) => {
  res.render("registration");
});

router.post("/", async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash("warning", "User exists, please choose another email or login");
      return res.render("registration", {
        name: username,
        message: {
          text: req.flash("warning"),
          category: "warning",
        },
      });
    }
    if (password !== passwordConfirm) {
      req.flash("warning", "Passwords do not match");
      return res.render("registration", {
        name: username,
        message: {
          text: req.flash("warning"),
          category: "warning",
        },
      });
    }
    const user = new User({ name: username, email, password });

    await user.save();

    //   we don't use "res.render('login', {email})" here to pass email value to login.hbs, because when we do it, our url will not change from /registration to /login, although we'll be on the login page.
    // so, passing email as a part of url, we'll get the value of email in login.js file and from there we'll pass it into 'login.hbs' view.
    const query = querystring.stringify({
      email: email,
      category: "success",
      text: "Registration successful!",
    });
    return res.redirect("/login?" + query);
  } catch (err) {
    console.log(err);
    req.flash("warning", "Something went wrong");
    return res.render("registration", {
      name: username,
      message: {
        text: req.flash("warning"),
        category: "warning",
      },
    });
  }
});

module.exports = router;
