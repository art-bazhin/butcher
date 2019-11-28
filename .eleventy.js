const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');
const translit = require('cyrillic-to-translit-js');

const SPACE = '-';

function preprocessItems(collection) {
  collection.items.forEach(item => {
    item.outputPath = translit().transform(item.outputPath, SPACE);
    item.url = translit().transform(item.url, SPACE);
    item.fileSlug = translit().transform(item.fileSlug, SPACE);
    item.filePathStem = translit().transform(item.filePathStem, SPACE);
  });
}

module.exports = function(eleventyConfig) {
  const cacheBusterOptions = {
    outputDirectory: 'dist'
  };

  eleventyConfig.addPlugin(cacheBuster(cacheBusterOptions));

  eleventyConfig.addCollection('categories', function(collection) {
    preprocessItems(collection);

    return collection.getAllSorted()
      .filter(el => el.data.category)
      .sort((a, b) => a.data.order - b.data.order);
  });

  eleventyConfig.addCollection('popular', function(collection) {
    return collection.getAllSorted().filter(el => el.data.popular);
  });

  return {
    dir: {
      output: 'dist',
      input: 'src',
      layouts: '_includes/layouts'
    }
  }
}