var mongoose = require("mongoose"),
  model = require("./model");

module.exports.connectToDb = function (connectionString) {
  if (mongoose.connection.readyState === 0) { // not open
    var options = {
      server: {
        socketOptions: []
      },
      replset: {
        socketOptions: []
      }
    };
    options.server.socketOptions = options.replset.socketOptions = {
      keepAlive: 1
    };
    console.log('Connecting to MongoDb with connectionstring:', connectionString);
    console.log('Connecting to MongoDb with options:', options);
    mongoose.connect(connectionString, options);
  }
};

module.exports.addRadar = function (name, callback) {
  var radar = new model.Radar();
  radar.name = name;

  model.Radar.create(radar,
    function (err, dbRadar) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, dbRadar);
    });
};

module.exports.getRadar = function (id, callback) {
  model.Radar.findOne({
    _id: id
  }, function (err, dbRadar) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, dbRadar);
  });
};