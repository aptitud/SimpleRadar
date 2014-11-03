var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost:27017/SimpleRadar";
var appPort = Number(process.env.PORT || 8080);

var config = {
  local: {
    appPort: appPort,
    mongoUri: mongoUri
  },
  prod: {
    appPort: appPort,
    mongoUri: mongoUri
  }
};

module.exports = function (mode) {
  return config[mode || process.argv[2] || 'local'] || config.local;
};