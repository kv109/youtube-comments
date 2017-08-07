const YT_CREDENTIALS = require(rootDir + 'config/youtube_credentials.json');
const Youtube = require("youtube-api");

const oauth = {
  oauth: Youtube.authenticate({
    type: "oauth",
    client_id: YT_CREDENTIALS.web.client_id,
    client_secret: YT_CREDENTIALS.web.client_secret,
    redirect_url: YT_CREDENTIALS.web.redirect_uris[0]
  }),

  authenticateWithAccessToken: (accessToken) => {
    Youtube.authenticate({
      type: "oauth",
      token: accessToken
    });
  }
};


module.exports = oauth;
