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

const basePageRouter = require("./routes/index"); //views qui montrent les chaussures
const authRoutes = require("./routes/auth-routes"); // views pour se logger
const adminRouter = require("./routes/admin"); // views secrètes

app.use(basePageRouter);
app.use(adminRouter);
app.use(authRoutes);

///////gérer les next///////
app.use((req, res, next) => {
  res.status(404);
  res.render("not-found");
});

app.use((err, req, res, next) => {
  // always log the error
  console.error("ERROR", req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render("error");
  }
});

const listener = app.listen(process.env.PORT || 8000, () => {
  console.log(`app started at ${process.env.SITE_URL}`);
});

module.exports = app;
