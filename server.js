var express = require('express'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    evercookie = require('evercookie'),
    favicon = require('serve-favicon');
    mongoose = require('mongoose'),
    logger = require('morgan'),
    csrf = require('csurf'),
    ejs = require('ejs'),
    app = express(),
    server = require('http').createServer(app),
    ews = require('express-ws')(app, server);

config = require('./config/config');
fs = require('fs');
sql = require('./config/models');
mongoose.connect(config.db);

app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.use(logger());
app.use(cookieParser());
app.use(evercookie.backend());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    name:'session',
    secret:'hey',
    cookie:{
        httpOnly:true,
        path:'/home'
    }
}));
app.use('/home', csrf());
function err404(req, res, next){
    return res.status(404).jsonp({err:404});
};
app.use(favicon(__dirname+'/static/favicon.ico'));
app.use('/static', express.static(__dirname+'/static'));
app.use('/home', function(req, res, next){
    if(!req.session.user)return err404(req, res, next);
    res.locals.token = req.csrfToken();
    res.header('X-Frame-Options', 'DENY');
    next();
});

app.route('/login')
    .get(function(req, res){
        res.render('login', {err:null});
    })
    .post(function(req, res){
        var name = req.body.name;
        var passwd = req.body.passwd;
        sql.User.findOne({name:name}, function(err, info){
            if(!info)return res.json({err:true});
            sql.User.findOne({
                name:name,
                passwd:sql.hash(passwd+config.key+name)
            }, function(err, info){
                if(!info)return res.json({err:true});
                req.session.user = info;
                res.json({err:null});
            });
        });
    });

var page = require('./routes/page'),
    home = require('./routes/home');

app.use('/home', home.router);
app.use('/', page.router);
app.ws('/home/page/:uri', page.ws);
app.ws('/e/:uri', page.ws);

app.use('*', err404);
app.listen(config.port, config.ip);
