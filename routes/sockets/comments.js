const _ = require("lodash");
const youtube = require("youtube-api");

module.exports = (io) => {
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
        order: "relevance",
        part: "snippet,replies",
        videoId: videoId
      };

      if (nextPageToken) {
        params.pageToken = nextPageToken;
      }

      youtube.commentThreads.list(params, (err, data) => {
        if (err) {
          console.error(err);
          // If order is "relevance", at some point it fails to fetch more comments and returns 400,
          // even though nextPageToken is returned (which indicates that there are more comments).
          // Such case can be treated as "all comments were fetched".
          if (err.code === 400) {
            socket.emit("all-comment-threads-fetched");
          } else {
            handleError(err);
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

    // TODO: fetch in infinite loop. Currently it fetches 100 and that's it.
    const fetchReplies = (data) => {
      const commentId = data.commentId;

      const params = {
        maxResults: 100,
        parentId: commentId,
        part: "snippet"
      };

      youtube.comments.list(params, (err, data) => {
        if (err) {
          handleError(err);
        } else {
          const replies = parseReplies(data);
          socket.emit("replies-fetched", {commentId, replies});
        }
      });
    };

    const fetchVideoDetails = (data) => {
      const videoId = data.videoId;

      const params = {
        id: videoId,
        part: "snippet"
      };

      youtube.videos.list(params, (err, data) => {
        if (err) {
          handleError(err);
        } else {
          const videoDetails = data.items[0];
          socket.emit("video-details-fetched", videoDetails);
        }
      });
    };

    const handleError = (err) => {
      const emitError = (error) => socket.error({error: error});  // TODO: extract to Error service

      if (err.code === 401 || err.message === "No access or refresh token is set." || err.message === "invalid_request") {
        emitError("Looks like your session has expired. Please try to sign in again.");
      } else if (err.code === 404) {
        emitError("Video not found.");
      } else {
        emitError("Could not fetch comments.");
      }
    };

    socket.on('fetch-comment-threads', fetchComments);
    socket.on('fetch-replies', fetchReplies);
    socket.on('fetch-video-details', fetchVideoDetails);
  });

  const parseComments = (data) => {
    let comments = _.map(data.items, (item) => {
      let replies;
      if (item.replies) {
        replies = item.replies.comments;
      }
      const id = item.snippet.topLevelComment.id;
      const snippet = item.snippet.topLevelComment.snippet;
      const data = {id, snippet};
      if (replies) {
        data.replies = replies;
      }
      return data;
    });

    return comments;
  };

  const parseReplies = (data) => {
    const replies = _.map(data.items, (item) => {
      return item.snippet;
    }).reverse();
    return replies
  };
};
