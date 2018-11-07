const path = require('path');
const fs = require('fs');

function loadModules(dir) {
  // Get "dir" stats
  fs.lstat(dir, function(err, stat) {
    // If "dir" is a directory
    if (stat.isDirectory()) {
      // Get all files in "dir"
      let files = fs.readdirSync(dir);
      let f,
        l = files.length;
      for (let i = 0; i < l; i++) {
        // Join the current directory and each file
        f = path.join(dir, files[i]);
        // Run this function again but with the newly joined file/dir
        loadModules(f);
      }
      // If "dir" is a file, load it. Also call an init function in the module on load.
    } else {
      require(dir)();
    }
  });
}

module.exports = loadModules;
