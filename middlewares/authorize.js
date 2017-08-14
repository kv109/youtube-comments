const youtube = require("youtube-api");
const YoutubeAPI = require(servicesDir + "oauth2");

// TODO: replace with passport.js
const authenticateWithAccessToken = (req, res, next) => {
  const tokens = req.session && req.session.tokens && req.session.tokens;
  const redirectToSignInPage = () => res.redirect('/');

  if (tokens) {
    YoutubeAPI.setCredentials(tokens); // If tokens are invalid, user won't be able to use YT API.
    res.locals.currentUser = req.session.currentUser;
    next();
  } else {
    req.flash("warning", "Your session has expired.");
    redirectToSignInPage();
  }
};

module.exports = {
  withAccessToken: authenticateWithAccessToken
};
