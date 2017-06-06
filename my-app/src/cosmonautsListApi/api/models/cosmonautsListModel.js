'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CosmonautSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    birthDate: {
        /*type: String*/
        type: Date,
        default: Date.now
    },
    ability: {
        type: String
    }
});

module.exports = mongoose.model('Cosmonauts', CosmonautSchema);