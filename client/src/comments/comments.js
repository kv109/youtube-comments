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
      alert(data.error);
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

const getNextPageLink = () => $('[data-is=next-page-link]');

const fetchComments = (data = {}) => {
  socket.emit("fetch-comment-threads", data)
};

const setNextPageLink = (nextPageToken) => {
  getNextPageLink().attr('data-next-page-token', nextPageToken);
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
