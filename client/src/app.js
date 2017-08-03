const io = require('socket.io-client');
const env = require(`../${process.env.NODE_ENV}`);
const socket = io.connect(env.webSocketApiUrl);

socket.emit('fetch-comment-threads');
socket.on('fetched-comment-threads', () => {
  console.log('hey! :)')
});