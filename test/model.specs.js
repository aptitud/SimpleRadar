var should = require('should'),
  model = require('../lib/model'),
  db = require('../lib/db'),
  testHelpers = require("./testHelpers");

describe('Radars', function () {

  before(function (done) {
    testHelpers.connectMongo();
    done();
  });

  after(function (done) {
    testHelpers.deleteAll();
    done();
  });

  it('A new Radar should be stored in with correct properties', function (done) {
    db.addRadar(function (err, newRadar) {
      should.not.exist(err);
      newRadar.should.have.property('_id');
      newRadar.should.have.property('name');
      newRadar.should.have.property('blips');
      done();
    });
  });

  it('Get an existing Radar', function (done) {
    db.addRadar(function (err, newRadar) {
      var id = newRadar._id;
      db.getRadar(id, function (err, getRadar) {
        should.not.exist(err);
        getRadar._id.should.eql(id);
        done();
      });
    });
  });
});