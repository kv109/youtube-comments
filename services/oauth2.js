const YT_CREDENTIALS = require(rootDir + 'config/youtube_credentials.json');
const Youtube = require("youtube-api");

const oauth = Youtube.authenticate({
  type: "oauth",
  client_id: YT_CREDENTIALS.web.client_id,
  client_secret: YT_CREDENTIALS.web.client_secret,
  redirect_url: YT_CREDENTIALS.web.redirect_uris[0]
});

const YoutubeAPI = {
  oauth: oauth,
  authenticateWithTokens: (tokens) => {
    oauth.setCredentials(tokens);
  }
};

module.exports = YoutubeAPI;
