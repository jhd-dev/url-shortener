var express = require("express");
var mongo = require("mongodb").MongoClient;
var path = require("path");

var app = express();
var port = process.env.PORT || 8080;

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/new/:url', function(req, res){
    mongo.connect()
    req.params.url 
});

app.get('/:id', function(req, res){
    
});

app.listen(port, function(){
    console.log("Listening on port " + port);
});