const authorize = require(rootDir + "/middlewares/authorize");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const oauth = require(servicesDir + "oauth2").oauth;
const youtube = require("youtube-api");

router.get('/dashboard', authorize.withAccessToken, (req, res) => {
  res.render('dashboard');
});

router.get('/jwt', authorize.withAccessToken, (req, res) => {
  const token = req.session.tokens.jwt;
  res.json({token});
});

router.get('/sign_in', (req, res) => {
  res.render('sign_in', {authorizationUrl: authorizationUrl()});
});

router.get('/oauth2callback', (req, res) => {
  console.log("Fetch tokens with code: ", req.query.code);
  const code = req.query.code;

  oauth.getToken(code, (err, tokens) => {
    if (err) {
      res.render("error", {error: err, message: "Could not authorize."});
    } else {
      tokens.jwt = jwtToken();
      req.session.tokens = tokens;
      res.redirect("/dashboard");
    }
  })
});

authorizationUrl = () => {
  return oauth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.force-ssl"]
  });
};

jwtToken = () => {
  jwt.sign(tokens, process.env.SECRET, {expiresIn: 60 * 60 * 8});  // TODO: handle expiration
};

module.exports = router;
