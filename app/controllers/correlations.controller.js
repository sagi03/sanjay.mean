const correlation = require('../models/correlations.model.js');
const moment = require('moment');

exports.findAll = (req, res) => {
    var findqry ={
     // "ActualPeriod": { "$gte": moment(req.query["StartDate"]).format('YYYY-MM-DD'), "$lte":  moment(req.query["EndDate"]).format('YYYY-MM-DD') }
     "ActualPeriod": { "$gte": moment(req.query["StartDate"]).format('YYYY-MM-DD')}

    };
 
    var startDate =req.query["StartDate"]
    var endDate = new Date(req.query["EndDate"]);
  var query = {
    "ActualPeriod": {
        "$gte": startDate
         ,"$lte":endDate
    }};
 
   //db.reservations.find({ 
   //ActualPeriod: { '$gte': new Date("Tue, 31 Mar 2015 02:30:00 GMT"), '$lte': new Date("Tue, 31 Mar 2015 03:30:00 GMT") }, 
   //BrandId: req.query["BrandId"], 
   //maxParty: { '$gte': 2 },
   // _user: { '$exists': false } })

   correlation.find(query)   
    .then(notes => {
       
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};