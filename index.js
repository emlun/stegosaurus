var child_process = require('child_process');
var sprintf = require('sprintf').sprintf;

var steghide_embed = module.exports.steghide_embed = function(image_path, message_path, password) {
  var steghidden_path = image_path + '.steghidden';

  child_process.execSync(sprintf(
      'steghide embed -N -cf "%s" -ef "%s" -p "%s" -sf "%s"',
      image_path,
      message_path,
      password,
      steghidden_path
  ));

  return steghidden_path;
};
