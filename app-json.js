var express  = require('express');
var app = express();
var server = require('http').createServer(app );
 
var config = require('./config.json');

var Db = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var dbURL = "mongodb://" + config.appSettings.mongolab.DB_USERNAME + ":" + config.appSettings.mongolab.DB_PASS + "@ds030827.mongolab.com:30827/MongoLab-cf";

app.configure(function(){
  app.use(express.bodyParser());
});

server.listen(3000);
var fs = require('fs');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/baseball.html');
});



app.use(express.static(__dirname + '/public'));


app.get('/baseball.html', function (req, res) {

		
  res.sendfile(__dirname + '/baseball.html');
});

app.get('/bb/:position/:year', function (req, res) {
		switch(req.params.year) {
		case "2014":
			get2014Projections(req.params.position,res);
			break;
		case "Spring":
			getSpringStats(req.params.position,res);
			break;
		default:
			getActualStats(req.params.position,req.params.year,res);
					
		}

});

app.get('/bb/closers', function (req, res) {
	var filePath = __dirname +"/json/closers2014.json";

	fs.readFile(filePath, 'utf8', function (err, data) {
	  if (err) {
	    console.log('Error: ' + err);
	    res.end();
	    return;
	  }
	 
	  var jsonObj = JSON.parse(data); 
	  res.json(jsonObj);
	  res.end();
	});

});

 Db.connect(dbURL, function(err, db) {
	app.get('/bb/exclusionList', function (req, res) {
 
	        var mlbExclusionList = db.collection("mlbExclusionList");

		mlbExclusionList.findOne({}, function (err, item) {
		    res.json(item);	
	   
	   });		
	});
	
	app.put('/bb/exclusionList', function (req, res) {
  	 
	        var mlbExclusionList = db.collection("mlbExclusionList");
	        var objID = new ObjectID(req.body._id);
	        var exclList = req.body;
	        exclList._id = objID;
	        console.log("start");
		//mlbExclusionList.findOne({}, function (err, item) {
		mlbExclusionList.update({"_id": objID},exclList,{upsert:true}
						,insertCallback);	
		console.log("end"+exclList);
		res.json(["hi"]);	
	   
	 	
	});	
		
});

function insertCallback(err, docs) {
	console.log("DOCS: " + docs);
		if(err) {
			console.log("error: " + err);	
			throw err;
		}

}

function get2014Projections(position,res) {
	var filePath = __dirname +"/json/" + position +  "Forecast2014.json";

	fs.readFile(filePath, 'utf8', function (err, data) {
	  if (err) {
	    console.log('Error: ' + err);
	    res.end();
	    return;
	  }
	 
	  var jsonObj = JSON.parse(data); 
	  res.json(jsonObj);
	  res.end();
	});		
}

function getActualStats(position,year,res) {
	var filePath = __dirname +"/json/" + position + year + ".json";

	fs.readFile(filePath, 'utf8', function (err, data) {
	  if (err) {
	    console.log('Error: ' + err);
	    res.end();
	    return;
	  }
	 
	  var jsonObj = JSON.parse(data); 
	  res.json(jsonObj.stats_sortable_player.queryResults.row);
	  res.end();
	});		
}

function getSpringStats(position,res) {
	position = position == "batters" ? "Batters" : "Pitchers";		
	var filePath = __dirname + "/json/spring"  + position +  "2014.json";
	var buf = '';	
	
	fs.readFile(filePath, 'utf8', function (err, data) {
	  if (err) {
	    console.log('Error: ' + err);
	    res.end();
	    return;
	  }
	 
	  var jsonObj = JSON.parse(data); 
	  res.json(jsonObj.stats_sortable_player.queryResults.row);
	  res.end();
	});
}


