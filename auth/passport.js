const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

const loginCheck = (passport) => {
  // Configure the local authentication strategy
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Check if a user with the provided email exists
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            // User not found
            console.log("Incorrect email");
            return done(null, false, { message: "Incorrect email" });
          }

          // Match Password
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) {
              console.error("Error comparing passwords:", error);
              return done(error);
            }

            if (isMatch) {
              // Passwords match, authentication successful
              return done(null, user);
            } else {
              // Passwords do not match
              console.log("Incorrect password");
              return done(null, false, { message: "Incorrect password" });
            }
          });
        })
        .catch((error) => {
          console.error("Error finding user:", error);
          return done(error);
        });
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      if (error) {
        console.error("Error deserializing user:", error);
        return done(error);
      }
      done(null, user);
    });
  });
};

module.exports = {
  loginCheck,
};
