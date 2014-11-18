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

module.exports.addRadar = function (size, callback) {
  var radar = new model.Radar(),
    width = 1200;

  if (size === "medium") {
    width = 992;
  }

  if (size === "small") {
    width = 768;
  }

  if (size === "xsmall") {
    width = 480;
  }

  radar.size = {
    width: width,
    height: width / (1024 / 768)
  };

  model.Radar.create(radar,
    function (err, dbRadar) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, dbRadar);
    });
};

var internalGetRadar = function (id, callback) {
  model.Radar.findById(id, function (err, dbRadar) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, dbRadar);
  });
};

module.exports.getRadar = internalGetRadar;

var internalSaveRadar = function (id, blips, callback) {
  internalGetRadar(id, function (err, dbRadar) {
    if (err) {
      callback(err, null);
      return;
    }

    dbRadar.blips = blips;
    dbRadar.save(function (err) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, dbRadar);
    });
  });
};

module.exports.saveRadar = internalSaveRadar;