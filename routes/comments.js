const express = require("express");
const router = express.Router();
const _ = require("lodash");
const youtube = require("youtube-api");
const authorize = require(rootDir + "/middlewares/authorize");

router.use(authorize.withAccessToken);

router.get('/', (req, res) => {
  youtube.commentThreads.list({
    part: "snippet,replies",
    videoId: "wVhJ_d4JrbY"
  }, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Could not fetch Comments.");
    } else {
      const comments = _.map(data.items, (item) => {
        return item.snippet.topLevelComment.snippet.textOriginal;
      });
      res.render("comments/index", {comments})
    }
  });
});

module.exports = router;
