const correlation = require('../models/correlationcoefficient.model.js');
const moment = require('moment');

exports.findAll = (req, res) => {
     correlation.find()   
    .then(notes => {
       
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};