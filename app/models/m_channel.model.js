const mongoose = require('mongoose');
var channelSchema = new mongoose.Schema({
    Id :  Number,
    ProjectId:Number,
    BrandId:Number,
    Name:String,
    DisplayName:String,
    Group:String,
    IsActive:Boolean   
}); 
module.exports = mongoose.model('m_channel', channelSchema);;