const io = require('socket.io-client');
const env = require(`../${process.env.NODE_ENV}`);
const socket = io.connect(env.webSocketApiUrl);

socket.on('fetched-comment-threads', (data) => {
  console.log('fetched-comment-threads', data)
  if (data.error) {
    return;
  }

  const comments = data.comments;
  const nextPageToken = data.nextPageToken;
  const $placeholder = $("[data-is=comments-placeholder]");

  comments.forEach((comment) => {
    $placeholder.append(commentHtml(comment));
  });

  getNextPageLink().remove();
  $placeholder.append(nextPageLink(nextPageToken));
});

const commentHtml = (comment) => {
  return $('<p>', {html: comment.textDisplay});
};

const getNextPageLink = () => $('[data-is=next-page-link]');

const fetchComments = (data = {}) => socket.emit("fetch-comment-threads", data);

const nextPageLink = (nextPageToken) => {
  const $link = $("<a>", {"data-is": "next-page-link", href: "#", text: "Fetch next 500"});
  $link.on("click", (event) => {
    event.preventDefault();
    fetchComments({nextPageToken})});
  return $link
};

fetchComments();
