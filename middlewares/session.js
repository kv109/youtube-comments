const session = require("express-session");
const redisStore = require("connect-redis")(session);

const redisClient = require(servicesDir + "redis_client");

module.exports = session({
  secret: process.env.SECRET,
  store: new redisStore({client: redisClient}),
  saveUninitialized: false,
  resave: false
});
