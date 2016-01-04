var child_process = require('child_process');
var sprintf = require('sprintf').sprintf;

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
      'steghide embed -N -cf "%s" -ef "%s" -p "%s" -sf "%s"',
      imagePath,
      messagePath,
      password,
      steghiddenPath
  ));

  return steghiddenPath;
};
