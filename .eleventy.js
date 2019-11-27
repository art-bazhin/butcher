const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');

module.exports = function(eleventyConfig) {
  const cacheBusterOptions = {
    outputDirectory: 'dist'
  };

  eleventyConfig.addPlugin(cacheBuster(cacheBusterOptions));

  eleventyConfig.addCollection('products', function(collection) {
    return collection.getAll().filter(el => el.data.type === 'product');
  });

  eleventyConfig.addCollection('popular', function(collection) {
    return collection.getAll().filter(el => el.data.popular);
  });

  return {
    dir: {
      output: 'dist',
      input: 'src',
      layouts: '_includes/layouts'
    }
  }
}