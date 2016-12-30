var express = require("express");
var mongo = require("mongodb").MongoClient;
var path = require("path");
var validUrl = require("valid-url");

var app = express();
var port = process.env.PORT || 8080;
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/urls';
var appURL = 'https://porygonj-url-shortener.herokuapp.com/';

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/new/:url', function(req, res){
    mongo.connect(mongoUrl, function(err, db){
        if (err) throw err;
        var url = req.params.url;
        var urls = db.collection('urls');
        urls.count({}, function(err, count){
            if (err) throw err;
            if (validUrl.isWebUri(url)){
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
    mongo.connect(mongoUrl, function(err, db){
        if (err) throw err;
        db.collection('urls').find({
            "_id": +req.params.id
        }).limit(1).toArray(function(err, docs){
            if (err) throw err;
            if (!docs.length){
                res.writeHead(200, {
                    "Content-Type": "text/html" 
                });
                res.end("<h1>Error: not found</h1>");
            } else {console.log(docs[0].original_url);
                res.redirect(docs[0].original_url);
            }
            db.close();
        });
    });
});

app.listen(port, function(){
    console.log("Listening on port " + port);
});