var express = require('express'),
    mongoose = require('mongoose'),
    logger = require('morgan'),
    ejs = require('ejs'),
    fs = require('fs'),
    app = express();

app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.use(logger('combined'));
app.use('/static', express.static(__dirname+'/static'));

app.all(/\/(.{0,3})/, function(req, res){
    //TODO
});

//TODO
