/**
 *
 */

var calculate = require("./hourcalculate");

var arg = process.argv.slice(2);


//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

var databaseName = "registers"; 

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/' + databaseName;

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        var doShow = function(id) {
            var collection = db.collection('registers');
            collection.find({_id: id}, {_id: 1, hours: 1}).toArray(function(err, items) {
                calculate.generate(items[0]);

                db.close();
            });
        };

        var doFind = function() {
            var collection = db.collection('registers');
            collection.find({}, {_id: 1, hours: 1}).toArray(function(err, items) {
                for(var item in items) console.log(items[item]);

                db.close();
            });
        };

        var addHour = function(id, hour) {
            // Adiciona uma hora no 


            var collection = db.collection('registers');
            collection.update(
                {"_id": id},
                {'$addToSet': {'hours': hour}},
                {'multi': true},
                function (err, count) {
                    doFind();
                }
            );
        };

        var setHour = function(id, hour) {
            var collection = db.collection('registers');
            collection.update(
                {"_id": id},
                {'$set': {'hours': hour}},
                {'multi': true},
                function (err, count) {
                    doFind();
                }
            );
        };

        var insertDay = function(id) {
            var collection = db.collection('registers');
            collection.insert(
                {
                    _id: id,
                    hours: []
                },
                function (err, count) {
                    
                }
            );

            db.close();
        };

        var dayID = 20160218;

        if(arg[0] == 'add') {
            // command: add
            // Responsable in to add hour registers in hour bank to a detemined day.
            // input:
            //  day: 
            //  hour:

            // systax: add 00:00
            var h = arg[1];
            if(h) {
                addHour(dayID, h);
            }

        } else if(arg[0] == 'set') {
            // systax: set 00:00
            var h = arg[1];
            if(h) {
                setHour(dayID, [ h ]);
            }

        } else if(arg[0] == 'find') {
            // systax: find
            doFind();

        } else if(arg[0] == 'insert') {
            // systax: insert
            insertDay(dayID);

        } else if(arg[0] == 'show') {
            // systax: show
            doShow(dayID);

        } else {
            console.log('Connection established to', url);
            db.close();
        }
    }
});
