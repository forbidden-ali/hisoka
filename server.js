var express = require('express'),
    mongoose = require('mongoose'),
    logger = require('morgan'),
    crypto = require('crypto'),
    ejs = require('ejs'),
    fs = require('fs'),
    app = express();

#   数据库
var models = require('./models');
mongoose.connect(models.Db);

#   模板引擎
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

#   其它
app.use(logger('combined'));
app.use('/static', express.static(__dirname+'/static'));

#   长逻辑, XSS处理部分
app.all('/', function(req, res){});
function page(){};
app.all('/page/:uri', page);
app.all('/v/:uri', page);

#   用户相关
app.get('/login', function(req, res){
    res.rendr('login');
});
app.post('/login', function(req, res){
    var name = req.body.name;
    var passwd = req.body.passwd;
    passwd = crypto.createHash('md5').update(
        passwd + models.User.find({name:name})['salt'];
    );
    models.User.findOne({name:name, passwd:passwd}, function(err, info){
        err&&res.status(500)&&res.render('500', {err:err});
        !info&&res.render('login', {err:'login failed.'});
        req.session.user = info;
        res.redirect('/home');
    });
});

#   主页及状态查看
app.get('/home', function(){});
app.get('/victim/:id', function(){});
app.get('/page/:uri/edit', function(){});

#   状态设置
app.post('/victim', function(){});
app.post('/page/:uri/edit', function(){});
