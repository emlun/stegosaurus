var express = require('express');
var multiparty = require('multiparty');
var fs = require('fs');
var _ = require('underscore');

var app = express();

var steghide_embed = require('.').steghide_embed;

app.post('/embed', function(req, res) {
  var form = new multiparty.Form({
    uploadDir: '/tmp/stegosaurus',
  });
  form.parse(req, function(err, fields, files) {
    if(err) {
      res.status(401).send('401 Bad request');
      return false;
    }

    var image_path = files.the_image[0].path;
    var secret_path = files.the_secret[0].path;

    var steghidden_path = steghide_embed(
      image_path,
      secret_path,
      fields.the_password[0]
    );

    function cleanup(image_path, secret_path, steghidden_path) {
      _([image_path, secret_path, steghidden_path]).each(function(path) { fs.unlink(path); });
    }

    res.download(steghidden_path, 'steghidden-' + files.the_image[0].originalFilename, function(err) {
      cleanup(image_path, secret_path, steghidden_path);
    });
  });
});

app.use(express.static('public'));

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Stegosaurus service listening at http://%s:%s', host, port);
});
