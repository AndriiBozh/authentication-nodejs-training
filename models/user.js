const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: [3, "Name is too short"],
      required: true,
    },
    email: {
      type: String,
      trim: true,
      //   unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address.",
      },
    },
    password: {
      type: String,
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  {
    methods: {
      validatePassword(data) {
        return bcrypt.compare(data, this.password);
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
