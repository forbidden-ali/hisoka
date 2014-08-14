var express = require('express'),
    session = require('express-session'),
    cookieParser = require('cookie-parser');
    bodyParser = require('body-parser');
    mongoose = require('mongoose'),
    logger = require('morgan'),
    crypto = require('crypto'),
    csrf = require('csurf'),
    ejs = require('ejs'),
    fs = require('fs'),
    app = express();

//   数据库
var sql = require('./models');
mongoose.connect(sql.Db);

//   模板引擎
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

//   其它
app.use(logger());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret:'session',
    cookie:{secre:true}
}));
app.use(csrf());
app.use('/static', express.static(__dirname+'/static'));

//   TODO 长逻辑, XSS处理部分
app.all('/', function(req, res){});
function page(){};
app.all('/page/:uri', page);
app.all('/v/:uri', page);

//   用户相关
app.route('/login')
    .get('/login', function(){
        res.rendr('login', {csrf:req.scrfToken()});
    })
    .post('/login', function(req, res){
        var name = req.body.name;
        var passwd = req.body.passwd;
        sql.User.findOne({name:name}, function(err, info){
            err&&res.status(500)&&res.rendr('500', {err:err});
            !info&&res.rendr('login', {err:'login failed.'});
            passwd = crypto.createHash('md5').update(
                passwd + info['salt']
            );
        });
        sql.User.findOne({name:name, passwd:passwd}, function(err, info){
            err&&res.status(500)&&res.render('500', {err:err});
            !info&&res.render('login', {err:'login failed.'});
            req.session.user = info;
            res.redirect('/home');
        });
    });
app.use('/home', function(req, res, next){
    !req.session.user?res.redirect('/login');
    next();
});
app.post('/home/logout', function(req, res){
    req.session.user = null;
    res.redirect('/login');
});

//   TODO 主页及查看
app.get('/home', function(req, res){});
app.get('/home/victim/:id', function(){});
app.get('/home/page/:uri/edit', function(){});

//   TODO 设置
app.post('/home/victim/:id/edit', function(){});
app.post('/home/page/:uri/edit', function(){});
