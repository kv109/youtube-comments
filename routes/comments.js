const express = require("express");
const router = express.Router();
const _ = require("lodash");
const youtube = require("youtube-api");
const authorize = require(rootDir + "/middlewares/authorize");

const routerWithSockets = (io) => {
  //TODO: move sockets API to somewhere else (routes/sockets/comments.js?)
  io.on('connection', (socket) => {

    const fetchComments = (data = {}) => {
      const videoId = data.videoId;
      const nextPageToken = data.nextPageToken;
      let i = data.i ? data.i : 0;

      if (i++ > 4) {
        socket.emit("comment-threads-batch-fetched");
        return
      }

      const params = {
        maxResults: 100,
        // order: "relevance",
        part: "snippet",
        videoId: videoId
      };

      if (nextPageToken) {
        params.pageToken = nextPageToken;
      }

      youtube.commentThreads.list(params, (err, data) => {
        if (err) {
          const emitError = (error) => socket.emit("comment-threads-fetched", {error: error});

          if (err.code === 401 || err.message === "No access or refresh token is set." || err.message === "invalid_request") {
            emitError("Looks like your session has expired. Please try to sign in again.");
          } else if (err.code === 404) {
            emitError(`Could not find video with id=${videoId}`);
          } else {
            emitError("Could not fetch comments.");
          }
        } else {
          const comments = parseComments(data);
          let nextPageToken = data.nextPageToken;
          if (!nextPageToken) {
            nextPageToken = 'lastPage';
            socket.emit("comment-threads-fetched", {comments, nextPageToken});
            socket.emit("all-comment-threads-fetched");
          } else {
            socket.emit("comment-threads-fetched", {comments, nextPageToken});
            fetchComments({i, nextPageToken, videoId})
          }
        }
      });
    };

    socket.on('fetch-comment-threads', fetchComments);
  });

  router.use(authorize.withAccessToken);

  router.get('/', (req, res) => {
    let error;
    const videoUrl = req.query.video_url;
    const videoId = videoUrl && videoUrl.slice(-11);
    if (!(videoId && videoId.length == 11)) {
      error = "Please provide a valid YouTube video URL, for example https://www.youtube.com/watch?v=wVhJ_d4JrbY";
    }

    if (error) {
      req.flash("danger", error);
      res.render("dashboard");
    } else {
      res.render("comments/index", {videoId});
    }
  });

  const parseComments = (data) => {
    let comments = _.map(data.items, (item) => {
      const snippet = item.snippet.topLevelComment.snippet;
      return {snippet};
    });

    return comments;
  };

  return router;
};

module.exports = routerWithSockets;
