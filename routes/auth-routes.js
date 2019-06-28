const express = require("express");
const authRoutes = express.Router();
const User = require("../models/User");

//Bcrypt pour encoder les mdp
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//////////LOGIN//////////////

authRoutes.get("/login", (req, res) => {
  res.render("login");
});

authRoutes.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;
  User.findOne({ username: theUsername })
    .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

//////////SIGN UP/////////////

authRoutes.get("/signup", (req, res, next) => {
  res.render("signup");
});

authRoutes.post("/signup", (req, res, next) => {
  //vérifier que l'utilisateur n'existe pas déjà
  const email = req.body.email;
  User.findOne({ email })
    .then(user => {
      if (user !== null) {
        res.render("signup", { message: "The username already exists" });
        return;
      }
      // s'il n'existe pas, on récupère son password et on le crypte
      const password = req.body.password;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      //on crée un nouvel utilisateur avec ses infos rentrées et son hashpass
      const { username, name, lastname } = req.body;
      User.create({
        username,
        name,
        lastname,
        email,
        password: hashPass
      })
        .then(() => res.redirect("/collection"))
        .catch(() => res.render("signup", { message: "Something went wrong" }));
    })
    .catch(error => {
      next(error);
    });
});

module.exports = authRoutes;
