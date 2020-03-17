const mongoose = require('mongoose');
var brandhealthschema = new mongoose.Schema({
    Period :  Date,
    ProjectId: Number,
    BrandId:Number 
}); 

module.exports = mongoose.model('t_brandhealthtrend_1', brandhealthschema);;