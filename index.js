const express = require("express");
const app = express();

app.get("/", (req, res) => res.sendFile("auth.html", { root: __dirname }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ` + port));

/* PASSPORT SETUP */

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

app.get("/success", (req, res) => res.send("You have successfully logged in"));
app.get("/error", (req, res) => res.send("error loggin in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/**
 *  FACEBOOK AUTH
 */

const FacebookStrategy = require("passport-facebook").Strategy;

const FACEBOOK_APP_ID = "your app id";
const FACEBOOK_APP_SECRET = "your app secret";

passport.use(
  new FacebookStrategy(
    {
      client: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/error" }),
  function (req, res) {
    res.redirect("/success");
  }
);

/**
 * GITHUB AUTH
 */

const GitHubStrategy = require("passport-github").Strategy;

const GITHUB_CLIENT_ID = "your app id";
const GITHUB_CLIENT_SECRET = "your app secret";

passport.use(
  new GitHubStratery(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/error" }),
  function (req, res) {
    res.redirect("/success");
  }
);
