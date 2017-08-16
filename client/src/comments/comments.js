const authorizeSockets = require('../sockets/authorize');
const commentTemplate = require('./comment_template');

let socket;

const bindNextPageLink = () => {
  getNextPageLink().on("click", (event) => {
    event.preventDefault();
    const $this = $(event.currentTarget);
    const nextPageToken = $this.attr('data-next-page-token');
    fetchComments({nextPageToken})
  });
};

const bindSockets = (callback) => {
  socket.on("all-comment-threads-fetched", () => {
    getNextPageLink().addClass("invisible");
    $("[data-is=all-comments-fetched-text]").removeClass("invisible");
    getSpinner().remove();
  });

  socket.on("comment-threads-batch-fetched", () => {
    getNextPageLink().removeClass("invisible");
    getSpinner().remove();
  });

  socket.on("comment-threads-fetched", (data) => {
    const comments = data.comments;
    const nextPageToken = data.nextPageToken;
    const $placeholder = $("[data-is=comments-placeholder]");

    comments.forEach((comment) => {
      const replies = comment.replies;
      const commentId = comment.id;
      comment = comment.snippet;
      $placeholder.append(commentTemplate(comment));
      if (replies) {
        $placeholder.append(showRepliesButton(commentId, replies.length));
      }
    });

    setNextPageLink(nextPageToken);
  });
  callback();

  socket.on("replies-fetched", (data) => {
    const commentId = data.commentId;
    const replies = data.replies;
    const $repliesPlaceholder = getRepliesPlaceholder(commentId);
    $repliesPlaceholder.removeClass("hidden-xs-up");
    replies.forEach((reply) => {
      $repliesPlaceholder.append(commentTemplate(reply));
    });
    getShowRepliesButton(commentId).text("Hide replies");
  });

  socket.on("video-details-fetched", (data) => {
    const $link = $("<a>", {
      href: `https://www.youtube.com/watch?v=${data.id}`,
      target: "_BLANK",
      text: data.snippet.title
    });
    $("[data-is=video-label]").append($link);
    $("[data-is=video-thumbnail]").attr({"src": data.snippet.thumbnails.default.url});
  })
};

const getNextPageLink = () => $("[data-is=next-page-link]");
const getRepliesContainer = (commentId) => $(`[data-replies-container=${commentId}]`);
const getRepliesPlaceholder = (commentId) => getRepliesContainer(commentId).find("[data-is=replies-placeholder]");
const getShowRepliesButton = (commentId) => getRepliesContainer(commentId).find("[data-is=show-replies-button]");
const getSpinner = () => $("[data-is=spinner]");
const getVideoId = () => $("[data-video-id]").data('video-id');

const fetchComments = (data = {}) => {
  data.videoId = getVideoId();
  socket.emit("fetch-comment-threads", data)
};

const fetchReplies = (commentId) => {
  socket.emit("fetch-replies", {commentId});
  getShowRepliesButton(commentId).text("Loading replies...");
};

const fetchVideoDetails = () => {
  const videoId = getVideoId();
  socket.emit("fetch-video-details", {videoId})
};

const setNextPageLink = (nextPageToken) => {
  const $nextPageLink = getNextPageLink();
  $nextPageLink.attr('data-next-page-token', nextPageToken);
};

const showRepliesButton = (commentId, repliesCount) => {
  const buttonHideRepliesText = "Hide replies";
  const buttonShowRepliesText = `Show replies (${repliesCount})`;
  const $container = $("<div>", {
    "data-replies-container": commentId
  });

  const $placeholder = $("<div>", {
    class: "hidden-xs-up replies-placeholder ml-5",
    "data-is": "replies-placeholder"
  });

  const $button = $("<div>", {
    class: "btn btn-small btn-secondary my-2",
    css: {
      color: "gray",
      fontSize: "smaller"
    },
    "data-is": "show-replies-button",
    text: buttonShowRepliesText,
    role: "button"
  }).on("click", function(event) {
    const $this = $(event.currentTarget);
    fetchReplies(commentId);
    $this.off("click").on("click", (event) => {
      const $this = $(event.currentTarget);
      $placeholder.toggleClass("hidden-xs-up");
      if ($this.text() === buttonHideRepliesText) {
        $this.text(buttonShowRepliesText)
      } else {
        $this.text(buttonHideRepliesText)
      }
    });
  });

  $container.append($button).append($placeholder);
  return $container
};

authorizeSockets(
  {
    success: (authorizedSocket) => {
      socket = authorizedSocket;
      bindSockets(() => {
        fetchComments();
        fetchVideoDetails();
        bindNextPageLink();
      })
    },
    error: () => console.log('error')
  }
);
