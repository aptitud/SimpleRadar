var mongoose = require("mongoose"),
  should = require("should"),
  db = require("../lib/db"),
  model = require("../lib/model"),
  config = require("../lib/config")("test");

module.exports.connectMongo = function () {
  db.connectToDb(config.mongoUri);
};

module.exports.deleteAll = function () {
  model.Radar.remove({}, function (err) {
    if (err) {
      console.log("Couldn't delete all documents\n" + err);
    }
  });
};