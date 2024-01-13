const express = require("express");
const app = express();
const connectDB = require("./db");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const { loginCheck } = require("./auth/passport");
loginCheck(passport);

// Database Connection
connectDB();

// View Engine
app.set("view engine", "ejs");

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 4002;
const router = require("./routes/login");

// Passport session
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use("/", router);

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
