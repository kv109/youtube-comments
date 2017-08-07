const youtube = require("youtube-api");
const authenticateWithAccessToken = require(servicesDir + "oauth2").authenticateWithAccessToken;

const authorizeWithAccessToken = (req, res, next) => {
  const accessToken = req.session && req.session.tokens && req.session.tokens.access_token;
  const redirectToSignInPage = () => res.redirect('/');

  if (accessToken) {
    authenticateWithAccessToken(accessToken);
    next();
  } else {
    redirectToSignInPage();
  }
};

module.exports = {
  withAccessToken: authorizeWithAccessToken
};
