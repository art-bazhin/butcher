module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection('products', function(collection) {
    return collection.getAll().filter(el => el.type === 'product');
  });

  eleventyConfig.addCollection('popular', function(collection) {
    return collection.getAll().filter(el => el.popular);
  });

  return {
    dir: {
      output: 'dist',
      input: 'src',
      layouts: '_includes/layouts'
    }
  }
}