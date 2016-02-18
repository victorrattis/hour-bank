var arg = process.argv.slice(2);;
// console.log(arg);


//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/registers';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        // console.log('Connection established to', url);

        // Get the documents collection
        var collection = db.collection('registers');

        // addHour(collection, 20160217, "19:30");

        var doFind = function() {
            collection.find({}, {_id: 1, hours: 1}).toArray(function(err, items) {
                for(var item in items) console.log(items[item]);

                db.close();
            });
        };

        var addHour = function(id, hour) {
            collection.update(
                {"_id": id},
                {'$addToSet': {'hours': hour}},
                // {'$set': {'hours': hour}},
                {'multi': true},
                function (err, count) {
                    doFind();
                }
            );
        };

        var insertData = function() {
            collection.insert(
                {},
                function (err, count) {
                    doInsert(i + 1);
                }
            );
        };

        if(arg[0] == 'add') {   
            var h = arg[1];
            if(h) {
                // addHour(20160217, h);
            }
        } else if(arg[0] == 'find') {
            doFind();
        } else {
            db.close();
        }

        // db.close();
        // doFind();
        // addHour(20160217, []);

        //Close connection
        // db.close();
    }
});