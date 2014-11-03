var mongoose = require("mongoose");

var Radar = mongoose.model("Radar", {
  name: String,
  blips: [Object]
});

module.exports.Radar = Radar;