var express = require('express')
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	bson = require('mongodb').BSONPure;

// --------------- CONFIGURE MONGODB CONNECTION  ------------------------------------------------------------ //
var mongoclient = new MongoClient(new Server('localhost', 27017, {"native_parser":true}));
var db = mongoclient.db('bookmarks');


// --------------- CONFIGURE WEB SERVER TO HANDLE REQUESTS -------------------------------------------------- //
app.use(express.bodyParser());
app.use(function(req, res, next){
  var apiKey = req.headers['api-key'];
  console.log("Acessing with api key: " + apiKey);
  return next();
});
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});


// --------------- API METHODS ------------------------------------------------------------------------------ //
app.get("/bookmark/", function(req, res){
	db.collection('bookmark').find({}, function(err, docs){
		if(err) throw err;

		docs.toArray(function(err, results){
			if(err) throw err;

			res.send(results);
		});
	});
});

app.get("/bookmark/:id", function(req, res){
	var oid = new bson.ObjectID(req.params.id);
	db.collection('bookmark').findOne({"_id": oid}, function(err, doc){
		if(err) throw err;

		res.send(doc);
	});
});

app.post("/bookmark/", function(req, res){
	var bookmark = req.body;

	if(bookmark._id) bookmark._id = new bson.ObjectID(bookmark._id);
	
	db.collection('bookmark').save(bookmark, function(err, doc){
		if(err) throw err;
		res.end();
	});
});

app.get("*", function(req, res){
	res.send("Page not found", 404);
});


// --------------- OPEN CONNECTION TO MONGODB, IF SUCCEED PUT WEB SERVER TO LISTEN REQUESTS ------------------ //
mongoclient.open(function(err, mongoclient){
	if(err) throw err;

	app.listen(80);
	console.log("Server listening on http://localhost:80");
});
