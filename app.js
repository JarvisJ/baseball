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

app.get('/bb/:position/:year', function (req, res) {
		switch(req.params.year) {
		case "2013":
			get2013Projections(req.params.position,res);
			break;
		case "Spring":
			getSpringStats(req.params.position,res);
			break;
		default:
			getActualStats(req.params.position,req.params.year,res);
					
		}

});

function get2013Projections(position,res) {
		Db.connect(dbURL, function(err, db) {
				
		   var collection = db.collection(position);
		 
 		   var sortKey = position=="pitchers"? ['mSOA',-1] :['mOPS',-1];
		  collection.find({"$or":[{'LG':'AL'},{'lg':'AL'}]}, {'sort':[['mOPS', -1]]}).toArray(function(err, documents) {
			  res.json(documents);
			  db.close();
			  res.end();
         });
	});			
}

function getActualStats(position,year,res) {
		Db.connect(dbURL, function(err, db) {
				
		   var collection = db.collection(position + year + "Web");
		   var sortKey = position=="pitchers"? ['p_ip',-1] :['ops',-1];
		  collection.find({}, {'sort':[sortKey]}).toArray(function(err, documents) {
			  res.json(documents);
			  db.close();
			  res.end();
         });
	});			
}

function getSpringStats(position,res) {
		Db.connect(dbURL, function(err, db) {
				position = position == "batters" ? "Batters" : "Pitchers";	
		   var collection = db.collection("spring" + position + "2012Web");
		   var sortKey = position=="Pitchers"? ['p_ip',-1] :['ops',-1];
		  collection.find({}, {'sort':[sortKey]}).toArray(function(err, documents) {
			  res.json(documents);
			  db.close();
			  res.end();
         });
	});			
}

