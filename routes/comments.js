const express = require("express");
const router = express.Router();
const _ = require("lodash");
const youtube = require("youtube-api");
const authorize = require(rootDir + "/middlewares/authorize");

const VIDEO_ID = "wVhJ_d4JrbY";

const routerWithSockets = (io) => {
  io.on('connection', (socket) => {
    socket.on('fetch-comment-threads', () => {
      youtube.commentThreads.list({
        maxResults: 100,
        order: "relevance",
        part: "snippet,replies",
        videoId: VIDEO_ID
      }, (err, data) => {
        if (err) {
          console.error(err);
          socket.emit("fetched-comment-threads", {error: err, message: "Could not fetch Comments."});
        } else {
          const comments = parseComments(data);
          socket.emit("fetched-comment-threads", {page: 1, comments: comments});
        }
      });
    });
  });

  router.use(authorize.withAccessToken);

  router.get('/', (req, res) => {
    const comments = [];
    res.render("comments/index", {comments});
  });

  const parseComments = (data) => {
    const comments = _.map(data.items, (item) => {
      const textDisplay = item.snippet.topLevelComment.snippet.textDisplay;
      let replies = [];
      if (item.replies && item.replies.comments) {
        replies = parseReplies(item.replies.comments);
      }
      return {textDisplay, replies};
    });

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
