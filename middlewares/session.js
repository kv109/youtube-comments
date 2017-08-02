const redis = require("redis");
const session = require("express-session");
const redisStore = require("connect-redis")(session);
const redisClient = redis.createClient({url: process.env.REDIS_URL});
require('dotenv').config();

module.exports = session({
  secret: process.env.SECRET,
  store: new redisStore({client: redisClient}),
  saveUninitialized: false,
  resave: false
});
