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

  it('A new Radar should be stored with correct properties', function (done) {
    db.addRadar("large", function (err, newRadar) {
      should.not.exist(err);
      newRadar.should.have.property('_id');
      newRadar.should.have.property('name');
      newRadar.should.have.property('blips');
      newRadar.should.have.property('size');
      done();
    });
  });

  it('A large Radar should have correct size', function (done) {
    db.addRadar("large", function (err, newRadar) {
      should.not.exist(err);
      newRadar.size.width.should.equal(1200);
      newRadar.size.height.should.equal(1200 / (1024 / 768));
      done();
    });
  });

  it('A medium Radar should have correct size', function (done) {
    db.addRadar("medium", function (err, newRadar) {
      should.not.exist(err);
      newRadar.size.width.should.equal(992);
      newRadar.size.height.should.equal(992 / (1024 / 768));
      done();
    });
  });

  it('A small Radar should have correct size', function (done) {
    db.addRadar("small", function (err, newRadar) {
      should.not.exist(err);
      newRadar.size.width.should.equal(768);
      newRadar.size.height.should.equal(768 / (1024 / 768));
      done();
    });
  });

  it('An extra small Radar should have correct size', function (done) {
    db.addRadar("xsmall", function (err, newRadar) {
      should.not.exist(err);
      newRadar.size.width.should.equal(320);
      newRadar.size.height.should.equal(320 / (1024 / 768));
      done();
    });
  });

  it('Get an existing Radar', function (done) {
    db.addRadar("large", function (err, newRadar) {
      var id = newRadar._id;
      db.getRadar(id, function (err, getRadar) {
        should.not.exist(err);
        getRadar._id.should.eql(id);
        done();
      });
    });
  });
});