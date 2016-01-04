var multiparty = require('multiparty');
var fs = require('fs');
var _ = require('underscore');

var steghide = require('./steghide');

module.exports.embedHandler = function(options) {
  options = options || {};
  _.defaults(options, {
    uploadDir: '/tmp/stegosaurus',
    imageFileParamName: 'the_image',
    messageFileParamName: 'the_secret',
    extractionPasswordParamName: 'the_password',
    responseFileNamePrefix: 'steghidden-',
  });

  return function(req, res) {
    var form = new multiparty.Form({
      uploadDir: options.uploadDir,
    });

    form.parse(req, function(err, fields, files) {
      if(err) {
        res.status(401).send('401 Bad request');
        console.log('Bad request', err);
        return false;
      }
      var imageFile = files[options.imageFileParamName][0];

      var imagePath = imageFile.path;
      var secretPath = files[options.messageFileParamName][0].path;

      var steghiddenPath = steghide.embed(
        imagePath,
        secretPath,
        fields[options.extractionPasswordParamName][0]
      );

      function cleanup(imagePath, secretPath, steghiddenPath) {
        _([imagePath, secretPath, steghiddenPath]).each(function(path) { fs.unlink(path); });
      }

      res.download(steghiddenPath, options.responseFileNamePrefix + imageFile.originalFilename, function(err) {
        cleanup(imagePath, secretPath, steghiddenPath);
      });
    });
  }
};
