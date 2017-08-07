const io = require('socket.io-client');

const authorize = (opts) => {
  $.getJSON('/jwt', (data) => {
    connect(data.token, opts)
  })
};

const connect = (jwtToken, opts) => {
  const onSuccess = opts.success;
  const onError = opts.error;

  const socket = io.connect(env.webSocketApiUrl, {
    query: 'token=' + jwtToken
  });

  socket.on('connect', () => {
    onSuccess(socket);
  });

  socket.on('disconnect', () => {
    onError(socket);
  })
};

module.exports = authorize;