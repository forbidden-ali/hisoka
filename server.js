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
    ews = require('express-ws')(app, server),
    page = require('./routes/page'),
    home = require('./routes/home');

config = require('./config/config'),
fs = require('fs'),
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
    secret:'session'
}));
app.use('/home', csrf());
function err404(req, res, next){
    return res.send(404, '( ・_・)');
};
app.use(favicon(__dirname+'/static/favicon.ico'));
app.use('/static', express.static(__dirname+'/static'));
app.use('/home', function(req, res, next){
    if(!req.session.user){return err404(req, res, next)};
    res.locals.token = req.csrfToken();
    res.header('X-Frame-Options', 'DENY');
    next();
});

app.route('/login')
    .get(function(req, res){
        res.render('login', {err:''});
    })
    .post(function(req, res){
        var name = req.body.name;
        var passwd = req.body.passwd;
        sql.User.findOne({name:name}, function(err, info){
            if(!info){return res.render('login', {err:'login failed.'})};
            sql.User.findOne({
                name:name,
                passwd:sql.hash(passwd+info.salt)
            }, function(err, info){
                if(!info){return res.render('login', {err:'login failed.'})};
                req.session.user = info;
                res.redirect('/home');
            });
        });
    });

app.use('/home', home);
app.use('/', page);

app.use('*', err404);
app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
    process.env.OPENSHIFT_NODEJS_IP);
