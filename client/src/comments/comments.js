const authorizeSockets = require('../sockets/authorize');
const commentTemplate = require('./comment_template');
const Flash = require("../modules/flash");

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
  socket.on("comment-threads-fetched", (data) => {
    const comments = data.comments;
    const nextPageToken = data.nextPageToken;
    const $placeholder = $("[data-is=comments-placeholder]");

    comments.forEach((comment) => {
      comment = comment.snippet;
      $placeholder.append(commentTemplate(comment));
    });

    setNextPageLink(nextPageToken);
  });
  callback();

  socket.on("comment-threads-batch-fetched", () => {
    getNextPageLink().removeClass("invisible");
    getSpinner().remove();
  });

  socket.on("all-comment-threads-fetched", () => {
    $("[data-is=all-comments-fetched-text]").removeClass("invisible");
    getSpinner().remove();
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

const getSpinner = () => $("[data-is=spinner]");
const getVideoId = () => $("[data-video-id]").data('video-id');

const fetchComments = (data = {}) => {
  data.videoId = getVideoId();
  socket.emit("fetch-comment-threads", data)
};

const fetchVideoDetails = () => {
  const videoId = getVideoId();
  socket.emit("fetch-video-details", {videoId})
};

const setNextPageLink = (nextPageToken) => {
  const $nextPageLink = getNextPageLink();
  $nextPageLink.attr('data-next-page-token', nextPageToken);
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
