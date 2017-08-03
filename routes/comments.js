const express = require("express");
const router = express.Router();
const _ = require("lodash");
const youtube = require("youtube-api");
const authorize = require(rootDir + "/middlewares/authorize");

const VIDEO_ID = "wVhJ_d4JrbY";

router.use(authorize.withAccessToken);

router.get('/', (req, res) => {
  youtube.commentThreads.list({
    maxResults: 100,
    order: "relevance",
    part: "snippet,replies",
    videoId: VIDEO_ID
  }, (err, data) => {
    if (err) {
      console.error(err);
      res.render("error", {error: err, message: "Could not fetch Comments."});
    } else {
      const comments = parseComments(data);
      res.render("comments/index", {comments})
    }
  });
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

module.exports = router;
