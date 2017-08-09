const Youtube = require("youtube-api");

const oauth = Youtube.authenticate({
  type: "oauth",
  client_id: process.env.YT_CLIENT_ID,
  client_secret: process.env.YT_CLIENT_SECRET,
  redirect_url: process.env.YT_REDIRECT_URI
});

const YoutubeAPI = {
  oauth: oauth,
  setCredentials: (tokens) => {
    oauth.setCredentials(tokens);
  }
};

module.exports = YoutubeAPI;
