var express = require('express');

 
var Db = require('./node_modules/mongodb').Db,
    Connection = require('./node_modules/mongodb').Connection,
    Server = require('./node_modules/mongodb').Server;

var dbURL = "mongodb://localhost:27017/test";

var app = express.createServer();
app.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/ndireport.js', function (req, res) {
  res.sendfile(__dirname + '/ndireport.js');
});

app.use(express.static(__dirname + '/public'));


app.get('/baseball.html', function (req, res) {

		
  res.sendfile(__dirname + '/baseball.html');
});

app.get('/bb/:position', function (req, res) {
	Db.connect(dbURL, function(err, db) {
		 var collection = db.collection(req.params.position);
		 
			console.log("===================================================================================");        
			console.log(">> batters/pitchers ordered by name ascending");        
			console.log("===================================================================================");        
			collection.find({"$or":[{'LG':'AL'},{'lg':'AL'}]}, {'sort':[['mOPS', -1]]}).toArray(function(err, documents) {
			  res.json(documents);
			  db.close();
			  res.end();
         });
	});		

});

