var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http);

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.set('port', (process.env.PORT || 8080));

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

http.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});

app.get('/', function (req, res) {
  res.sendFile('index.html');
});