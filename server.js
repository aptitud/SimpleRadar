var express = require('express'),
  app = express(),
  io = require('socket.io'),
  db = require('./lib/db'),
  config = require('./lib/config')(),
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json();

db.connectToDb(config.mongoUri);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.set('port', config.appPort);

var server = app.listen(config.appPort, function () {
  console.log("Node app is running at: " + config.appPort);
});

var ios = io.listen(server);

ios.on('connection', function (socket) {
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

  socket.on('delete blip', function (blip) {
    console.log('delete blip', blip);
    socket.broadcast.emit('delete blip', blip);
  });
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

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/start.html');
});

app.get('/radars/:id', function (request, response) {
  response.sendFile(__dirname + '/public/radar.html');
});

app.post('/api/radars', jsonParser, function (request, response) {
  db.addRadar(request.body.size, function (err, result) {
    if (err) {
      sendError(response, err, 500);
    } else {
      sendResult(response, result, 201);
    }
  });
});

app.put('/api/radars/:id', jsonParser, function (request, response) {
  db.saveRadar(request.params.id, request.body.blips, function (err, result) {
    if (err) {
      sendError(response, err, 500);
    } else {
      sendResult(response, result, 200);
    }
  });
});

app.get('/api/radars/:id', jsonParser, function (request, response) {
  db.getRadar(request.params.id, function (err, result) {
    if (err) {
      sendError(response, err, 500);
    } else {
      sendResult(response, result, 200);
    }
  });
});