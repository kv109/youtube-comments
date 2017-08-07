const youtube = require("youtube-api");
const authenticate = require(servicesDir + "oauth2").authenticateWithAccessToken;

const authenticateWithAccessToken = (req, res, next) => {
  const accessToken = req.session && req.session.tokens && req.session.tokens.access_token;
  const redirectToSignInPage = () => res.redirect('/');

  if (accessToken) {
    authenticate(accessToken);
    next();
  } else {
    redirectToSignInPage();
  }
};

module.exports = {
  withAccessToken: authenticateWithAccessToken
};
