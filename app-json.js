var express  = require('express');
var app = express();
var server = require('http').createServer(app );
 
server.listen(3000);
var fs = require('fs');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/baseball.html');
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
	var filePath = __dirname +"/json/" + position +  "Forecast2013.json";

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
	var filePath = __dirname + "/json/spring"  + position +  "2013.json";
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


