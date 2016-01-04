var child_process = require('child_process');
var path = require('path');
var fs = require('fs.extra');
var sprintf = require('sprintf').sprintf;
var tmp = require('tmp');
var _ = require('underscore');

/**
 * @param imagePath the path to the image to use as the "cover file" -cf
 *   argument to steghide
 * @param messagePath the path to the file to use as the "embed file" -ef
 *   argument to steghide
 * @param password the password to use for encrypting the message before
 *   embedding it
 * @return the path to the created stego file
 */
module.exports.embed = function(imagePath, messagePath, password) {
  var steghiddenPath = imagePath + '.steghidden';

  child_process.execSync(sprintf(
      'steghide embed -cf "%s" -ef "%s" -p "%s" -sf "%s"',
      imagePath,
      messagePath,
      password,
      steghiddenPath
  ));

  return steghiddenPath;
};

module.exports.extract = function(imagePath, password, callback) {
  var tmpdir = tmp.dirSync();

  var output = child_process.exec(
    sprintf(
      'steghide extract -sf "%s" -p "%s"',
      imagePath,
      password
    ), {
      cwd: tmpdir.name,
    }, function(err, stdout, stderr) {
      var outputFileName = _(stderr.split('"')).chain()
        .rest()
        .initial()
        .value()
        .join('"');

      var cleanup = _.once(function() {
        fs.rmrfSync(tmpdir.name);
      });

      callback(path.join(tmpdir.name, outputFileName), cleanup);
    }
  );

};
