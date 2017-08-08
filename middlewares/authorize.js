const youtube = require("youtube-api");
const authenticate = require(servicesDir + "oauth2").authenticateWithTokens;

const authenticateWithAccessToken = (req, res, next) => {
  const tokens = req.session && req.session.tokens && req.session.tokens;
  const redirectToSignInPage = () => res.redirect('/');

  if (tokens) {
    authenticate({});
    next();
  } else {
    redirectToSignInPage();
  }
};

module.exports = {
  withAccessToken: authenticateWithAccessToken
};
