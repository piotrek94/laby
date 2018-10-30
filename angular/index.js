var express = require('express');
var bodyParser = require('body-parser');
require('./models/posts');
var api = require('./routes/api');
var app = express();

//	Sekcja	middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api', api);


module.exports = app;

/*
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
Post.findById(id, function (err, post) {
})
*/
