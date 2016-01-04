var multiparty = require('multiparty');
var fs = require('fs.extra');
var path = require('path');
var _ = require('underscore');

var steghide = require('./steghide');

/**
 * Build a request handler around steghide embed
 *
 * @param options the settings to use for the request handler. Expects an
 *   object with zero or more of the following keys. The format for the below
 *   is `name`: type (default).
 *
 *    - `uploadDir`: String (`/tmp/stegosaurus`) the path under which to store
 *      temporary files
 *    - `imageFileParamName`: String (`the_image`) the name of the HTTP query
 *      parameter containing the cover image data
 *    - `messageFileParamName`: String (`the_secret`) the name of the HTTP
 *      query parameter containing the message file data
 *    - `extractionPasswordParamName`: String (`the_password`) the name of the
 *      HTTP query parameter containing the extraction password
 *    - `responseFileNamePrefix`: String (`steghidden-`) the prefix to prepend
 *      to the uploaded image file name for the result file
 */
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
      var secretFile = files[options.messageFileParamName][0];

      var imagePath = imageFile.path;
      var secretPath = secretFile.path;
      var secretDir = secretPath + '.d';

      var prettySecretPath = path.join(secretDir, path.basename(secretFile.originalFilename));

      fs.mkdirSync(secretDir);
      fs.move(secretPath, prettySecretPath, function(err) {
        if(err) {
          res.status(503).send('503 Internal server error');
          console.log(err);
          return false;
        }

        var steghiddenPath = steghide.embed(
          imagePath,
          prettySecretPath,
          fields[options.extractionPasswordParamName][0]
        );

        function cleanup() {
          _([imagePath, secretPath, secretDir, steghiddenPath]).each(function(path) { fs.rmrfSync(path); });
        }

        res.download(steghiddenPath, options.responseFileNamePrefix + imageFile.originalFilename, cleanup);
      });
    });
  }
};
