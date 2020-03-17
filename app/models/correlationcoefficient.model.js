const mongoose = require('mongoose');
var marketcontextschema = new mongoose.Schema({
    Metric1 :  String,
    Metric2 :  String,
    Value:Number
}); 

module.exports = mongoose.model('t_correlationcoefficient_1', marketcontextschema);;