var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var request = require("request");

app.set("view engine", "ejs");
mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(express.static("public"));
var showSchema = new mongoose.Schema({
	title: String,
	poster: String,
	fav_char: String,
	fav_season: Number,
	imdb: Number,
	num_of_seasons: Number,
	num_of_episodes: Number,
	fav_couple: String
})

var Show = mongoose.model("Show", showSchema);

// Show.create({title: "Sherlock",
//  poster: "https://cdn.europosters.eu/image/750/posters/sherlock-destruction-i61036.jpg",
//  fav_char: "Irene Adler"
// 	});



//INDEX ROUTE
app.get("/", function(req, res){
	res.redirect("/shows");
});

//NEW ROUTE
app.get("/shows", function(req, res){
	Show.find({}, function(err, shows){
		if(err){
			console.log("something went wrong lol!!");
		}
		else{
			res.render("index", {shows: shows});
		}		
	});	
});
//CREATE ROUTE
app.get("/shows/new", function(req, res){
	res.render("new");
});
app.post("/shows", function(req, res){

	Show.create(req.body.show, function(err, newShow){
		if(err){
			console.log("error lol");
		}
		else{
			res.redirect("/shows");
		}
	});
});
//SHOW ROUTE
app.get("/shows/:id", function(req, res){
	Show.findById(req.params.id, function(err, foundShow){
		if(err){
			console.log("ERROR ON SHOW ROUTE")
		}
		else{
			res.render("show", {show: foundShow})
		}
	})
})
//EDIT ROUTE
app.get("/shows/:id/edit", function(req, res){
	Show.findById(req.params.id, function(err, foundShow){
		if(err){
			console.log("ERROR ON EDIT ROUTE");
		}
		else{
			res.render("edit", {show: foundShow})
		}
	})
})

//UPDATE ROUTE
app.put("/shows/:id", function(req, res){
	Show.findByIdAndUpdate(req.params.id, req.body.show, function(err, updatedShow){
		if(err){
			console.log("ERROR ON UPDATE ROUTE")
		}
		else{
			res.redirect("/shows/"+req.params.id);
		}
	})
})
//DELETE ROUTE
app.delete("/shows/:id", function(req, res){
	Show.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("ERROR ON DELETE PAGE");
		}
		else{
			res.redirect("/shows");
		}
	})
})


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("LISTENING ON PORT 3000");
});

