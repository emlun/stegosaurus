var express = require('express');
var multiparty = require('multiparty');
var fs = require('fs');
var _ = require('underscore');

var app = express();

var steghideEmbed = require('.').steghideEmbed;

app.post('/embed', function(req, res) {
  var form = new multiparty.Form({
    uploadDir: '/tmp/stegosaurus',
  });
  form.parse(req, function(err, fields, files) {
    if(err) {
      res.status(401).send('401 Bad request');
      return false;
    }

    var imagePath = files.the_image[0].path;
    var secretPath = files.the_secret[0].path;

    var steghiddenPath = steghideEmbed(
      imagePath,
      secretPath,
      fields.the_password[0]
    );

    function cleanup(imagePath, secretPath, steghiddenPath) {
      _([imagePath, secretPath, steghiddenPath]).each(function(path) { fs.unlink(path); });
    }

    res.download(steghiddenPath, 'steghidden-' + files.the_image[0].originalFilename, function(err) {
      cleanup(imagePath, secretPath, steghiddenPath);
    });
  });
});

app.use(express.static('public'));

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Stegosaurus service listening at http://%s:%s', host, port);
});
