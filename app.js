var express = require("express");
var mongo = require("mongodb").MongoClient;
var path = require("path");

var app = express();
var port = process.env.PORT || 8080;
var appURL = 'https://porygonj-url-shortener.herokuapp.com/';
var notFoundPage = '';

function isValidURL (url) {
    return true;
}

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/new/:url', function(req, res){
    mongo.connect('mongodb:localhost:' + port + '/urls', function(err, db){
        if (err) throw err;
        var url = req.params.url;
        var urls = db.collection('urls');
        urls.count({}, function(err, count){
            if (err) throw err;
            var toInsert;
            if (isValidURL(url)){
                urls.insert({
                    "_id": +count,
                    "original_url": url,
                    "new_url": appURL + count
                }, function(err, data){
                    if (err) throw err;
                    db.close();
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        "original_url": url,
                        "new_url": appURL + count
                    }));
                });
            } else {
                db.close();
                res.end(JSON.stringify({
                    "error": "invalid URL"
                }));
            }
        });
    });
});

app.get('/:id', function(req, res){
    mongo.connect('mongodb:localhost:' + port + '/urls', function(err, db){
        if (err) throw err;
        db.collection.find({
            "_id": +req.params.id
        }).toArray(function(err, docs){
            if (err) throw err;
            if (!docs.length){
                res.redirect(notFoundPage);
            } else {
                res.redirect(docs[0].new_url);
            }
            db.close();
        });
    });
});

app.listen(port, function(){
    console.log("Listening on port " + port);
});