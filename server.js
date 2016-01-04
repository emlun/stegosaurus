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

    var steghidden_path = steghide_embed(
      files.the_image[0].path,
      files.the_secret[0].path,
      fields.the_password[0]
    );

    res.download(steghidden_path, 'steghidden-' + files.the_image[0].originalFilename);

    _(files.the_image).each(function(file) { fs.unlink(file.path); });
    _(files.the_secret).each(function(file) { fs.unlink(file.path); });
  });
});

app.use(express.static('public'));

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Stegosaurus service listening at http://%s:%s', host, port);
});
