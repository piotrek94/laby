var	express	=	require('express');
var	api	= require('./routes/api');
var	app	=	express();
app.use('/api',	api);
module.exports	=	app;

var	mongoose	=	require('mongoose');
mongoose.connect("mongodb://localhost:27017/dbname")
var	Schema	=	mongoose.Schema;
var	postSchema	=	new	mongoose.Schema({
				created_by:	String,
				created_at:	{type:	Date,	default:	Date.now},
				text:	String
});
mongoose.model('Post',	postSchema);