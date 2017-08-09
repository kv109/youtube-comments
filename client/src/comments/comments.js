const commentTemplate = require('./comment_template');
const authorizeSockets = require('../sockets/authorize');

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
  socket.on("fetched-comment-threads", (data) => {
    if (data.error) {
      console.error(data.error);
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
};

const getNextPageLink = () => $("[data-is=next-page-link]");

const getVideoId = () => $("[data-video-id]").data('video-id');

const fetchComments = (data = {}) => {
  data.videoId = getVideoId();
  socket.emit("fetch-comment-threads", data)
};

const setNextPageLink = (nextPageToken) => {
  const $nextPageLink = getNextPageLink();
  $nextPageLink.attr('data-next-page-token', nextPageToken);
  if (nextPageToken === "lastPage") {
    $nextPageLink.attr({disabled: "disabled", "aria-disabled": true}).text("There are no more comments");
  }
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
