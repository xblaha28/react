'use strict';
module.exports = function(app) {
  var cosmonautList = require('../controllers/cosmonautsListController');


  // todoList Routes
  app.route('/cosmonauts')
    .get(cosmonautList.list_all_cosmonauts)
    .post(cosmonautList.create_a_cosmonaut);


  app.route('/cosmonauts/:cosmonautId')
    .get(cosmonautList.read_a_cosmonaut)
    .put(cosmonautList.update_a_cosmonaut)
    .delete(cosmonautList.delete_a_cosmonaut);
};
