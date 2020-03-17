const brandhealth = require('../models/brandhealth.model.js');
const moment = require('moment');

exports.findAll = (req, res) => {
       var startDate =new Date(req.query["StartDate"]);
    var endDate = new Date(req.query["EndDate"]);
  var query = {
    "Period": {
        "$gte": startDate
         ,"$lte":endDate
    }};
 
    brandhealth.find(query)   
    .then(notes => {
       
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};