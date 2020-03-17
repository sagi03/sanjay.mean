const mongoose = require('mongoose');
var marketcontextschema = new mongoose.Schema({
    Id:Number,
    Period :  Date,
    ProjectId:Number,
    BrandId:Number,
    DimId:Number,
    ChannelId:Number,
    MetricId:Number , 
    Value:Number  
}); 

module.exports = mongoose.model('t_marketcontext_1ss', marketcontextschema);;