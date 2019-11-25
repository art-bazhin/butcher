const zipFolder = require('zip-a-folder');

class ZipAFolder {
  static main() {
    zipFolder.zipFolder('./dist', './dist.zip', function(err) {
      if(err) {
          console.log('Failed to zip!', err);
      }
    });
  }
}

ZipAFolder.main();