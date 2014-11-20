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
      newRadar.size.width.should.equal(580);
      newRadar.size.height.should.equal(580 / (1024 / 768));
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
  it('Save a Radar', function (done) {
    db.addRadar("large", function (err, newRadar) {
      var id = newRadar._id,
        blips = [];
      blips.push({
        radarId: id,
        id: 1,
        text: "Node.js",
        x: 100,
        y: 100
      });
      db.saveRadar(id, blips, function (err, dbRadar) {
        should.not.exist(err);
        dbRadar._id.should.eql(id);
        dbRadar.blips.length.should.equal(1);
        dbRadar.blips[0].data.length.should.equal(1);
        dbRadar.blips[0].data[0].radarId.toString().should.equal(id.toString());
        dbRadar.blips[0].data[0].id.should.equal(1);
        dbRadar.blips[0].data[0].text.should.equal("Node.js");
        dbRadar.blips[0].data[0].x.should.equal(100);
        dbRadar.blips[0].data[0].y.should.equal(100);
        done();
      });
    });
  });
});