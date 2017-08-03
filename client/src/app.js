const io = require('socket.io-client');
const env = require(`../${process.env.NODE_ENV}`);
const socket = io.connect(env.webSocketApiUrl);

socket.emit('fetch-comment-threads');

socket.on('fetched-comment-threads', (data) => {
  if (data.error) { return; }

  const page = data.page;
  const comments = data.comments;

  const containerSelector = `[data-page="${page}"]`;
  const $container = $(containerSelector);

  comments.forEach((comment) => {
    $container.append(commentHtml(comment));
  });
});

const commentHtml = (comment) => {
  return $('<p>', {html: comment.textDisplay});
};
