const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
  const token = socket.handshake.query.token;

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        socket.error({error: err.name});
      } else {
        socket.error({error: "Could not authorize"});
      }
      console.warn(`socket: Could not authorize with token=${token}`);
      socket.disconnect();
    } else {
      console.log(`socket: Successfully authorized`);
      next();
    }
  })
};
