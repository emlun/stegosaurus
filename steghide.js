var child_process = require('child_process');
var sprintf = require('sprintf').sprintf;

module.exports.embed = function(imagePath, messagePath, password) {
  var steghiddenPath = imagePath + '.steghidden';

  child_process.execSync(sprintf(
      'steghide embed -N -cf "%s" -ef "%s" -p "%s" -sf "%s"',
      imagePath,
      messagePath,
      password,
      steghiddenPath
  ));

  return steghiddenPath;
};
