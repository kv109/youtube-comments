const express = require("express");
const router = express.Router();
const oauth = require(servicesDir + "oauth2").oauth;
const authorize = require(rootDir + "/middlewares/authorize");
const youtube = require("youtube-api");

router.get('/dashboard', authorize.withAccessToken, (req, res) => {
  res.render('dashboard');
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
    }

    req.session.tokens = tokens;
    res.redirect("/dashboard");
  })
});

authorizationUrl = () => {
  return oauth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.force-ssl"]
  });
};

module.exports = router;
