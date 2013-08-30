var express = require('express'),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	bson = require('mongodb').BSONPure;

// --------------- CONFIGURE MONGODB CONNECTION  ------------------------------------------------------------ //
var mongoclient = new MongoClient(new Server('localhost', 27017, {"native_parser":true}));
var db = mongoclient.db('bookmarks');
var bookmarks = db.collection('bookmark');

// --------------- CONFIGURE WEB SERVER TO HANDLE REQUESTS -------------------------------------------------- //
app.use(authentication);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function authentication(req, res, next){
  var apiKey = req.headers['api-key'];

  if(!apiKey)
  	throw new Error("Api key não informada.");
  
  return next();
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.send(500, {"message": err.message});
}


// --------------- API METHODS ------------------------------------------------------------------------------ //
app.get("/bookmark/", function(req, res){
	bookmarks.find().toArray(function(err, results){
		if(err) throw err;

		res.send(results);
	});
});

app.get("/bookmark/:id", function(req, res){
	var oid = new bson.ObjectID(req.params.id);
	bookmarks.findOne({"_id": oid}, function(err, doc){
		if(err) throw err;

		res.send(doc);
	});
});

app.del("/bookmark/:id", function(req, res){
	var oid = new bson.ObjectID(req.params.id);
	bookmarks.remove({"_id": oid});
});

app.post("/bookmark/", function(req, res){
	var bookmark = req.body;

	if(bookmark._id) bookmark._id = new bson.ObjectID(bookmark._id);
	
	bookmarks.save(bookmark, function(err, doc){
		if(err) throw err;
		res.end();
	});
});

app.get("*", function(req, res){
	res.send("Not found", 404);
});

// --------------- OPEN CONNECTION TO MONGODB, IF SUCCEED PUT WEB SERVER TO LISTEN REQUESTS ------------------ //
mongoclient.open(function(err, mongoclient){
	if(err) throw err;

	app.listen(80);
	console.log("Server listening on http://localhost:80/");
});