var mongoose = require("mongoose");

var Radar = mongoose.model("Radar", {
  name: String,
  blips: [{
    id: Number,
    text: String,
    x: Number,
    y: Number
  }],
  size: Object
});

module.exports.Radar = Radar;