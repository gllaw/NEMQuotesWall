//REQUIRE-------------------------------------------------------------------------------------------------------
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 

//USE------------------------------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/quoting_dojo');

//SCHEMA--------------------------------------------------------------------------------------------------------
var QuoteSchema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 2},
	content: {type: String, required: true, maxlength: 140}
}
, {timestamps: true}
);
var Quote = mongoose.model("Quote",QuoteSchema);

//ROUTES--------------------------------------------------------------------------------------------------------
app.get('/', function(req, res){
	res.render("index");
});

app.post("/quotes", function(req,res){
	var quote = new Quote(req.body
	// {
	// 	name: req.body.name,
	// 	content: req.body.content,
	// 	// time: {type: Date, default: Date.now}
	// }
	);
	quote.save(function(err){
		if(err){
			res.render("index", {title:"Couldn't save.", errors: quote.errors});
		}
		else{
			res.redirect("/quotes");
		}
	})
})

app.get("/quotes", function(req,res){
	Quote.find({}, function(err,results){
    	if(err){
    		console.log(err);
    	}
    	else{
    		res.render("quotes",{"quotes":results});
    	}	
    }).sort("-createdAt")
});

//SERVER LISTEN-------------------------------------------------------------------------------------------------
app.listen(8888, function(){
	console.log("Quoting Dojo is in port 8888");
})

