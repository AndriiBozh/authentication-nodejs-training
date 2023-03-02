require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");

const index = require("./routes/index");
const login = require("./routes/login");
const registration = require("./routes/registration");
const terms = require("./routes/terms");
const logout = require("./routes/logout");

require("./auth-local-passport");

const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

// connect to mongoDB

// handle initial connection errors
mongoose
  .connect(process.env.MONGODB_URL, { dbName: "Users" })
  .catch((error) => {
    handleError(error);
  });

//   handle errors after initial connection was established
mongoose.connection.on("error", (err) => {
  logError(err);
});

// end of connect to mongoDB

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(passport.authenticate("session"));

app.use(flash());

app.use(express.json());
// for data coming from a form
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "hbs");

app.use("/", index);
app.use("/login", login);
app.use("/logout", logout);
app.use("/registration", registration);
app.use("/terms", terms);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
