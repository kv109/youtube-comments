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
    if (data.error) {
      Flash.display(data.error, "danger");
      return;
    }

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
  })
};

const getNextPageLink = () => $("[data-is=next-page-link]");

const getSpinner = () => $("[data-is=spinner]");
const getVideoId = () => $("[data-video-id]").data('video-id');

const fetchComments = (data = {}) => {
  data.videoId = getVideoId();
  socket.emit("fetch-comment-threads", data)
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
        bindNextPageLink();
      })
    },
    error: () => console.log('error')
  }
);
