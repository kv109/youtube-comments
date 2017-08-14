const express = require("express");
const router = express.Router();
const authorize = require(rootDir + "/middlewares/authorize");

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
    res.render("dashboard");  // TODO: Do not assume that user came from /dashboard
  } else {
    res.render("comments/index", {videoId});
  }
});

module.exports = router;
