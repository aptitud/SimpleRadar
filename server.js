var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  db = require('./lib/db'),
  config = require('./lib/config')(),
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json();

db.connectToDb(config.mongoUri);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.set('port', config.appPort);

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('new blip', function (blip) {
    console.log('new blip', blip);
    socket.broadcast.emit('new blip', blip);
  });
  socket.on('move blip', function (blip) {
    socket.broadcast.emit('move blip', blip);
  });
});

http.listen(config.appPort, function () {
  console.log("Node app is running at: " + config.appPort);
});

var sendError = function (response, msg, code) {
  response.status(code)
    .send('Ooops something went wrong: ' + msg)
    .end();
};

var sendResult = function (response, result, code) {
  response.status(code)
    .send(result)
    .end();
};

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.post('/radars', jsonParser, function (request, response) {
  db.addRadar(request.body.name, function (err, result) {
    if (err) {
      sendError(response, err, 500);
    } else {
      sendResult(response, result, 201);
    }
  });
});