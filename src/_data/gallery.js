const fs = require('fs');
const path = require('path');
 
const DIR = path.resolve(__dirname, '..//img/gallery');
const PREFIX = '/img/gallery/';
 
const photos = fs.readdirSync(DIR).map(item => PREFIX + item);
module.exports = photos;