const express = require("express");
const router = express.Router();
const _ = require("lodash");
const youtube = require("youtube-api");
const authorize = require(rootDir + "/middlewares/authorize");

const VIDEO_ID = "wVhJ_d4JrbY";

const routerWithSockets = (io) => {
  io.on('connection', (socket) => {
    const fetchComments = (data = {}) => {
      console.log('fetchComments', data)
      const nextPageToken = data.nextPageToken;
      let i = data.i ? data.i : 0;

      if (i++ > 1) {
        return
      }

      const params = {
        maxResults: 2,
        // order: "relevance",
        part: "snippet,replies",
        videoId: VIDEO_ID
      };

      if (nextPageToken) {
        params.pageToken = nextPageToken;
      }

      youtube.commentThreads.list(params, (err, data) => {
        if (err) {
          console.error(err);
          if(err.message === "No access or refresh token is set.") {
            // TODO: do sth
          }
          socket.emit("fetched-comment-threads", {error: err, message: "Could not fetch Comments."});
        } else {
          const comments = parseComments(data);
          const nextPageToken = data.nextPageToken;
          socket.emit("fetched-comment-threads", {comments, nextPageToken});
          fetchComments({i, nextPageToken})
        }
      });
    };

    socket.on('fetch-comment-threads', fetchComments);
  });

  router.use(authorize.withAccessToken);

  router.get('/', (req, res) => {
    const comments = [];
    res.render("comments/index", {comments});
  });

  const parseComments = (data) => {
    let comments = _.map(data.items, (item) => {
      const snippet = item.snippet.topLevelComment.snippet;
      const publishedAt = snippet.publishedAt;
      const textDisplay = snippet.textDisplay;

      let replies = [];
      if (item.replies && item.replies.comments) {
        replies = parseReplies(item.replies.comments);
      }
      return {textDisplay, publishedAt, replies};
    });

    // comments = _.sortBy(comments, (comment) => comment.publishedAt);
    return comments;
  };

  const parseReplies = (replies) => {
    replies = _.map(replies, (reply) => {
        const textDisplay = reply.snippet.textDisplay;
        const publishedAt = reply.snippet.publishedAt;
        return {textDisplay, publishedAt}
      }
    );
    replies = _.sortBy(replies, (item) => item.publishedAt);
    return replies;
  };

  return router;
};

module.exports = routerWithSockets;
