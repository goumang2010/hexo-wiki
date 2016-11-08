/* global hexo */
const yaml = require('yaml-front-matter');

hexo.extend.filter.register('after_post_render', (data) => {
  let github = yaml.loadFront(data.raw).github;
  if (github !== undefined) {
    data.github = github;
  }
  return data;
});
