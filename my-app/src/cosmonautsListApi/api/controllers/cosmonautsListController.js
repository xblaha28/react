'use strict';


var mongoose = require('mongoose'),
  Cosmonaut = mongoose.model('Cosmonauts');

exports.list_all_cosmonauts = function(req, res) {
  Cosmonaut.find({}, function(err, cosmonaut) {
    if (err)
      res.send(err);
    res.json(cosmonaut);
  });
};




exports.create_a_cosmonaut = function(req, res) {
  var new_cosmonaut = new Cosmonaut(req.body);
  new_cosmonaut.save(function(err, cosmonaut) {
    if (err)
      res.send(err);
    res.json(cosmonaut);
  });
};


exports.read_a_cosmonaut = function(req, res) {
  Cosmonaut.findById(req.params.cosmonautId, function(err, cosmonaut) {
    if (err)
      res.send(err);
    res.json(cosmonaut);
  });
};


exports.update_a_cosmonaut = function(req, res) {
  Cosmonaut.findOneAndUpdate(req.params.cosmonautId, req.body, {new: true}, function(err, cosmonaut) {
    if (err)
      res.send(err);
    res.json(cosmonaut);
  });
};


exports.delete_a_cosmonaut = function(req, res) {


  Cosmonaut.remove({
    _id: req.params.cosmonautId
  }, function(err, cosmonaut) {
    if (err)
      res.send(err);
    res.json({ message: 'Cosmonaut successfully deleted' });
  });
};