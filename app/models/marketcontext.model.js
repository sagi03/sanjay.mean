const mongoose = require('mongoose');
var marketcontextschema = new mongoose.Schema({
    Period :  Date,
    ProjectId:Number,
    BrandId:Number,
    DimId:Number,
    ChannelId:Number,
    MetricId:Number , 
    Value:Number,
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'm_channel' }],
}); 
module.exports = mongoose.model('t_marketcontext_1', marketcontextschema);;