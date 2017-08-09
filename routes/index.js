const authorize = require(rootDir + "/middlewares/authorize");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const youtube = require("youtube-api");
const YoutubeAPI = require(servicesDir + "oauth2");

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

  YoutubeAPI.oauth.getToken(code, (err, tokens) => {
    if (err) {
      res.render("sign_in", {
        alert: {text: "Could not authorize. Please try again.", type: "alert-danger"},
        authorizationUrl: authorizationUrl()
      });
    } else {
      YoutubeAPI.setCredentials(tokens);
      youtube.channels.list({mine: true, maxResults: 1, part: "snippet"}, (err, data) => {
        if (err) {
          console.error(err);
          res.render("sign_in", {
            alert: {text: "Could not authorize", type: "alert-danger"},
            authorizationUrl: authorizationUrl()
          })
        } else { // Authorization successful, could fetch channels.
          const channelTitle = data.items[0].snippet.title;
          tokens.jwt = jwtToken(tokens);
          req.session.tokens = tokens;
          req.session.currentUser = { name: channelTitle };
          res.redirect("/dashboard");
        }
      });
    }
  })
});

authorizationUrl = () => {
  return YoutubeAPI.oauth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.force-ssl"]
  });
};

jwtToken = (tokens) => {
  return jwt.sign(tokens, process.env.SECRET, {expiresIn: 60 * 60 * 8});  // TODO: handle expiration
};

module.exports = router;
