const marketcontext = require('../models/marketcontext.model.js');
const cc = require('../models/correlationcoefficient.model.js');
const brandhealth = require('../models/brandhealth.model.js');

exports.findAll = (req, res) => {
    var projectId= parseInt(req.query["ProjectId"]);
    if(!req.query["ProjectId"]) {
        return res.status(400).send({
            message: "Project Id is not mentioned."
        });
    }
var startDate =req.query["StartDate"]!=undefined ? new Date(req.query["StartDate"]) : new Date("2014-01-01");
  var endDate =req.query["EndDate"]!=undefined ? new Date(req.query["EndDate"]) : new Date("2020-01-01");
 
  var query = {
    "BrandId" : parseInt(  req.query["BrandId"]),
    "ProjectId" : parseInt(  req.query["ProjectId"]),
    "Period": {
        "$gte": startDate
         ,"$lte":endDate
    }};
    var pipeline = [
        { 
            "$project" : { 
                "_id" : 0, 
                "tmc" : "$$ROOT"
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tmc.ChannelId", 
                "from" : "m_channel", 
                "foreignField" : "Id", 
                "as" : "mc"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mc", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tmc.BrandId", 
                "from" : "m_brand", 
                "foreignField" : "Id", 
                "as" : "mb"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mb", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tmc.MetricId", 
                "from" : "m_metrics", 
                "foreignField" : "Id", 
                "as" : "mm"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mm", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tmc.DimId", 
                "from" : "t_project_dimension_1", 
                "foreignField" : "Id", 
                "as" : "tpd"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$tpd", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tpd.MarketId", 
                "from" : "m_markets", 
                "foreignField" : "Id", 
                "as" : "mMark"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mMark", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tpd.ProductId", 
                "from" : "m_products", 
                "foreignField" : "Id", 
                "as" : "mProd"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mProd", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        {
            //"$match:{"name":"abc","city":"delhi","$and":[{"age":{"$ne":""}},{"age":{"$ne":null}}]}}"
            "$match" : { 
                "$and" : [
                    { 
                        
                        "tmc.ProjectId" :projectId
                    },
                    { 
                        "mc.Group" : {"$in":["Volume","PricingVscompetitors","Paid Media","CRM","Other Media","Execution Data"]}
                    }, 
                    { 
                        "tmc.Period" : { 
                            "$gte" :  startDate
                        }
                    }, 
                    { 
                        "tmc.Period" : { 
                            "$lte" :   endDate
                        }
                    }
                ]
            }
        }, 
        // { 
        //     "$project" : { 
        //         "Period" : "$tmc.Period", 
        //         "Value" : "$tmc.Value", 
        //         "ChannelId" : "$tmc.ChannelId", 
        //         "ChannelName" : "$mc.Name", 
        //         "BrandId" : "$tmc.BrandId", 
        //         "BrandName" : "$mb.Name", 
        //         "Group" : "$mc.Group", 
        //         "MetricId" : "$tmc.MetricId", 
        //         "MetricName" : "$mm.Name", 
        //         "MarketId" : "$tpd.MarketId", 
        //         "MarketIdName" : "$mMark.Name", 
        //         "_id" : 0
        //     }
        // },
        {
            "$group":{
                "_id" : { 
                    "Period" : { "$dateToString": { format: "%Y-%m-%d", date: "$tmc.Period" } }, 
                    "ProjectId" : "$tmc.ProjectId", 
                    "ChannelName" : "$mc.Name", 
                    "BrandName" : "$mb.Name", 
                    "MarketName" : "$mMark.Name" ,
                    "periodYear"  : { "$dateToString": { format: "%Y", date: "$tmc.Period" } },
                    "periodMonth"  : { "$dateToString": { format: "%m/%Y", date: "$tmc.Period" } }
                },
                "items":{
                    "$addToSet":{"name":"$mm.Name","value":"$tmc.Value"}
                }
                
            }
        },{
            "$project" : { 
                "tmp":{
                    $arrayToObject:{
                    $zip:{
                        inputs:["$items.name", "$items.value"]
                    }
                }
            }
            
        }
        }
        ,{
            "$addFields" : {
                "tmp.Period" : "$_id.Period", 
                "tmp.ProjectId" : "$_id.ProjectId", 
                "tmp.ChannelName" : "$_id.ChannelName", 
                "tmp.BrandName" : "$_id.BrandName", 
                "tmp.MarketName" : "$_id.MarketName",//"$_id.MarketName"
                //"DateMarketName" : "$_id.MarketName"
                "tmp.periodYear" : "$_id.periodYear",
                "tmp.periodMonth" : "$_id.periodMonth"

            }
        },
        {
            "$replaceRoot":{
                newRoot:"$tmp"
        }
        }
        // {
        //     "$group" : { 
        //         "_id" : { 
        //             "Period" : "$tmc.Period", 
        //             "ChannelId" : "$tmc.ChannelId", 
        //             "ChannelName" : "$mc.Name", 
        //             "BrandId" : "$tmc.BrandId", 
        //             "BrandName" : "$mb.Name", 
        //             "Group" : "$mc.Group", 
        //             "MarketId" : "$tpd.MarketId", 
        //             "MarketIdName" : "$mMark.Name", 
        //         },
        //         "abc" : { 
        //                             "$push" : {
        //                                 "MetricId" : "$tmc.MetricId", 
        //                                 "MetricName" : "$mm.Name",
        //                                 "Value" : "$tmc.Value",
        //                             }
        //         }

        //     }
        // },{ 
        //             "$project" : { 
        //                 "_id" : 0.0, 
        //                  "key" : "$_id", 
        //                  "value" : "$abc"
        //             }
        //          }
    ];
    var pipelinecorrelations = [
        { 
            "$project" : { 
                "_id" : 0, 
                "tmc" : "$$ROOT"
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tmc.ChannelId", 
                "from" : "m_channel", 
                "foreignField" : "Id", 
                "as" : "mc"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mc", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tmc.BrandId", 
                "from" : "m_brand", 
                "foreignField" : "Id", 
                "as" : "mb"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mb", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tmc.MetricId", 
                "from" : "m_metrics", 
                "foreignField" : "Id", 
                "as" : "mm"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mm", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tmc.DimId", 
                "from" : "t_project_dimension_1", 
                "foreignField" : "Id", 
                "as" : "tpd"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$tpd", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tpd.MarketId", 
                "from" : "m_markets", 
                "foreignField" : "Id", 
                "as" : "mMark"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mMark", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tpd.ProductId", 
                "from" : "m_products", 
                "foreignField" : "Id", 
                "as" : "mProd"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$mProd", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        {
            
            "$match" : { 
                "$and" : [
                    { 
                        
                        "tmc.ProjectId" :projectId
                    },
                    { 
                        "mc.Group" : {"$in":["Volume","Brand Health","Paid Media","Execution Data"]}
                    }, 
                    { 
                        "tmc.Period" : { 
                            "$gte" :  startDate
                        }
                    }, 
                    { 
                        "tmc.Period" : { 
                            "$lte" :   endDate
                        }
                    }
                ]
            }
        }, 
       
        {
            "$group":{
                "_id" : { 
                    "Period" : { "$dateToString": { format: "%Y-%m-%d", date: "$tmc.Period" } }, 
                    "ProjectId" : "$tmc.ProjectId", 
                    "ChannelName" : "$mc.Name", 
                    "BrandName" : "$mb.Name", 
                    "MarketName" : "$mMark.Name" ,
                    "periodYear"  : { "$dateToString": { format: "%Y", date: "$tmc.Period" } },
                    "periodMonth"  : { "$dateToString": { format: "%m/%Y", date: "$tmc.Period" } }
                },
                "items":{
                    "$addToSet":{"name":"$mm.Name","value":"$tmc.Value"}
                }
                
            }
        },{
            "$project" : { 
                "tmp":{
                    $arrayToObject:{
                    $zip:{
                        inputs:["$items.name", "$items.value"]
                    }
                }
            }
            
        }
        }
        ,{
            "$addFields" : {
                "tmp.Period" : "$_id.Period", 
                "tmp.ProjectId" : "$_id.ProjectId", 
                "tmp.ChannelName" : "$_id.ChannelName", 
                "tmp.BrandName" : "$_id.BrandName", 
                "tmp.MarketName" : "$_id.MarketName",//"$_id.MarketName"
                //"DateMarketName" : "$_id.MarketName"
                "tmp.periodYear" : "$_id.periodYear",
                "tmp.periodMonth" : "$_id.periodMonth"

            }
        },
        {
            "$replaceRoot":{
                newRoot:"$tmp"
        }
        }
   
    ];
      Promise.all([ // this will run in parallel
       
        brandhealth.find(),
        marketcontext.aggregate(pipeline),
        cc.find(),
        marketcontext.aggregate(pipelinecorrelations),
       
       
        
      ]).then( function onSuccess([ brandHealth,marketcontext, CC,C ]) {
        res.json({
            BrandHealthTrend:brandHealth,
            MarketContext: marketcontext,
            Correlation: {CorrelationData : C, CorrelationCoefficient:CC}
            
        });
      });
    
 
};
