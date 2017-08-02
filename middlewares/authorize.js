const youtube = require("youtube-api");

const authorizeWithAccessToken = (req, res, next) => {
  const accessToken = req.session && req.session.tokens && req.session.tokens.access_token;
  const redirectToSignInPage = () => res.redirect('/');

  if (accessToken) {
    youtube.authenticate({
      type: "oauth",
      token: accessToken
    });
    next();
  } else {
    redirectToSignInPage();
  }
};

module.exports = {
  withAccessToken: authorizeWithAccessToken
};
