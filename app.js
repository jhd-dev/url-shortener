var express = require("express");
var mongo = require("mongodb").MongoClient;
var path = require("path");

var app = express();
var port = process.env.PORT || 8080;

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/new/:url', function(req, res){
    mongo.connect('mongodb:localhost:' + port + '/urls', function(err, db){
        if (err) throw err;
        var urls = db.collection('urls');
        urls.count({}, function(err, count){
            if (err) throw err;
            var toInsert = {
                "original_url": req.params.url,
                "new_url": count
            };
            urls.insert(toInsert, function(err, data){
                if (err) throw err;
            });
        });
    });
});

app.get('/:id', function(req, res){
    
});

app.listen(port, function(){
    console.log("Listening on port " + port);
});