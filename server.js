var express = require('express');

var stegosaurus = require('.');

var app = express();
app.post('/embed', stegosaurus.embedHandler());
app.post('/extract', stegosaurus.extractHandler());
app.use(express.static('public'));

var server = app.listen(8085, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Stegosaurus service listening at http://%s:%s', host, port);
});
