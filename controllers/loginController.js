const User = require("../models/user");
const bcrypt = require("bcryptjs");

// For Register Page
const registerView = (req, res) => {
  res.render("register", {});
};

// For View
const loginView = (req, res) => {
  res.render("login", {});
};

const registerUser = async (req, res) => {
  // console.log(req.body.name);
  // console.log(req.body.email);
  // console.log(req.body.password);
  // console.log(req.body.confirm);
  try {
    const { name, email, location, password, confirm } = req.body;

    // Check for empty fields
    if (!name || !email || !password || !confirm) {
      throw new Error("Please fill in all the fields.");
    }

    // Confirm password
    if (password !== confirm) {
      throw new Error("Passwords must match.");
    }

    // Check if the email already exsist
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw new Error("Email already exists. Please use a different email.");
    }

    // Create a new user
    const newUser = await new User({
      name,
      email,
      location,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the new user to the database
    await newUser.save();

    // Redirect to the login page after successful registration
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error.message);

    // Render the registration page with error messages
    res.render("register", {
      error: error.message,
    });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Please fill in all the fields");
    res.render("login", {
      email,
      password,
    });
  } else {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res);
  }
};

module.exports = {
  loginView,
  registerView,
  registerUser,
  loginUser,
};
