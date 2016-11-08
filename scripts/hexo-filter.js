var yaml = require('yaml-front-matter');

hexo.extend.filter.register('after_post_render', function(data) {
  var github = yaml.loadFront(data.raw).github;
  if (github !== undefined){
    data.github = github;
  }
  return data;
});
