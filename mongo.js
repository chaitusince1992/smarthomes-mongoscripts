var mongo = module.exports = {};

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

mongo.getCollection = function (callbackSuccess, callbackError) {
    MongoClient.connect("mongodb://localhost:27017/smartgridnew", function (err, db) {
        if (err) {
            console.dir(err);
            callbackError(err);
        } else {
            console.log("Successfully connected");
            callbackSuccess(db);
//            callbackSuccess(db.collection(collectionName));
            //            db.close();
        }
        //    collection = db.collection('sample');
    });
}
