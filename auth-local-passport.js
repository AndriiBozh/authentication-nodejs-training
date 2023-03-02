const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      username: user.name,
      email: user.email,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, cb) => {
      try {
        const user = await User.findOne({ email: username });

        if (!user) {
          return cb(null, false, { message: "No user found" });
        }
        const passwordVarified = await user.validatePassword(password);
        if (!passwordVarified) {
          return cb(null, false, { message: "Wrong password" });
        }

        return cb(null, user);
      } catch (err) {
        console.log("from catch");
        cb(err);
      }
    }
  )
);
