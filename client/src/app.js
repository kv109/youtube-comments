window.env = require(`../${process.env.NODE_ENV}`);

global.Tether = require("tether");
require("bootstrap");

$(() => {
  const scriptToLoad = $('[data-load]').attr('data-load');
  if(scriptToLoad) {
    console.log('Loading ', scriptToLoad);
    require(`./${scriptToLoad}`);
  }
});
