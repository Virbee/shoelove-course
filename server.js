const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const hbs = require("hbs");
require("dotenv").config();
require("./config/db_connection"); // database initial setup

const app = express();

//////SET UP VIEWS/////////

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
hbs.registerPartials(__dirname + "/views/partials");

/////////SESSIONS///////
app.use(
  session({
    secret: "shoeloverdev",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

///////IS LOGGED ?////////////

function isLoggedIn(req, res, next) {
  app.locals.isLoggedIn = Boolean(req.session.currentUser);
  next();
}
app.use(isLoggedIn);

function isLoggedOut(req, res, next) {
  app.locals.isLoggedOut = Boolean(!req.session.currentUser);
  next();
}
app.use(isLoggedOut);

/////////ROUTES////////

const basePageRouter = require("./routes/index"); //views qui montrent les chaussures
const authRoutes = require("./routes/auth-routes"); // views pour se logger
const adminRouter = require("./routes/admin"); // views secrètes

app.use(basePageRouter);
app.use(adminRouter);
app.use(authRoutes);

///////404 ERROR FUNCTION///////
app.use((req, res, next) => {
  res.status(404);
  res.render("not-found");
});

const listener = app.listen(process.env.PORT || 8000, () => {
  console.log(`app started at ${process.env.SITE_URL}`);
});

module.exports = app;
