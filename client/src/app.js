window.env = require(`../${process.env.NODE_ENV}`);

$(() => {
  const scriptToLoad = $('[data-load]').attr('data-load');
  if(scriptToLoad) {
    console.log('Loading ', scriptToLoad);
    require(`./${scriptToLoad}`);
  }
});
