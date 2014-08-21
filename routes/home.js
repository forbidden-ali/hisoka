exports.login = {
    get:function(req, res){
        res.render('login', {err:''});
    },
    post:function(req, res){
        var name = req.body.name;
        var passwd = req.body.passwd;
        sql.User.findOne({name:name}, function(err, info){
            if(!info){return res.render('login', {err:'login failed.'})};
            sql.User.findOne({
                name:name,
                passwd:sql.gethash(passwd+info.salt)
            }, function(err, info){
                if(!info){return res.render('login', {err:'login failed.'})};
                req.session.user = info;
                res.redirect('/home');
            });
        });
    },
    logout:function(req, res){
        req.session.user = null;
        res.redirect('/login');
    }
};

exports.home = function(req, res){
    var victim, page;
    sql.Victim.find({owner:req.session.user.name}, function(err, info){
        victims = info;
        sql.Page.find({owner:req.session.user.name}, function(err, info){
            pages = info;
            sql.Item.find({owner:req.session.user.name}, function(err, info){
                items = info;
                res.render('home', {
                    items:items,
                    victims:victims,
                    pages:pages
                });
            });
        });
    });
};

exports.item = {
    item:function(req, res){
        sql.Item.findOne({owner:req.session.user.name, id:req.params.name}, function(err, info){
            if(!info){return err404(req, res)};
            res.render('edit', {
                items:info
            });
        });
    },
    edit:function(req, res){
        var name = req.params.name;
        if(!name){
            return res.json({status:'error, name?'});
        };
        sql.Item.findOne({owner:req.session.user.name, name:name}, function(err, info){
            if(info){
                sql.Item.update({name:name}, {
                    owner:req.body.owner||info.owner,
                    name:name,
                    payload:req.body.payload||info.payload,
                    load:JSON.parse(req.body.load)||info.payload,
                    modules:JSON.parse(req.body.modules)||info.modules
                }, function(err, info){
                   res.json({
                        status:err||'update ok.'
                    });
                });
            }else{
                sql.Item.create({
                    owner:req.body.owner||req.session.user.name,
                    name:name,
                    payload:req.body.payload,
                    load:JSON.parse(req.body.load),
                    modules:JSON.parse(req.body.modules)
                }, function(err){
                    res.json({
                        status:err||'create ok.'
                    });
                });
            };
        });
    },
};
exports.victim = {
    victim:function(req, res){
        sql.Victim.findOne({owner:req.session.user.name, id:req.params.name}, function(err, info){
            if(!info){return err404(req, res);};
            res.render('edit', {
                victims:info
            });
        });
    },
    edit:function(req, res){
        var id = req.params.id;
        if(req.param('type')=='delete'){
            sql.Victim.remove({_id:id, owner:req.session.user.name}, function(err){
                res.json({
                    status:err||'remove ok.'
                });
            });
        }else{
            sql.Victim.find({_id:id, owner:req.session.user.name}, function(err, info){
                if(!info){return err404(req, res)};
                sql.Victim.findByIdAndUpdate(id, {
                    owner:req.body.owner||info.owner,
                    name:req.body.name||info.name,
                    payload:req.body.payload||info.payload,
                    load:JSON.parse(req.body.load)||info.load,
                    modules:JSON.parse(req.body.modules)||info.modules,
                    status:JSON.parse(req.body.modules)||info.status,
                }, function(err, info){
                    return res.json({status:(err||info?'':'not found.')});
                });
            });
        };
    }
};
exports.page = {
    page:function(req, res){
        sql.Page.findOne({owner:req.session.user.name, uri:req.params.uri}, function(err, info){
            if(!info){return err404(req, res)};
            return res.render('editpage', {
                pages:info
            });
        });
    },
    edit:function(req, res){
        var id = req.params.id;
        if(req.param('type')=='delete'){
            sql.Page.remove({_id:id, owner:req.session.user.name}, function(err){
                res.json({
                    status:err||'remove ok.'
                });
            });
        }else{
            sql.Page.findOne({_id:id, owner:req.session.user.name}, function(err, info){
                if(info){
                    sql.Page.update({_id:id, owner:req.session.user.name}, {
                        owner:req.body.owner||info.owner,
                        name:req.body.name||info.name,
                        uri:req.body.uri||info.uri,
                        type:req.body.type||info.type,
                        modules:JSON.parse(req.body.modules)||info.modules
                    }, function(err){
                        res.json({
                            status:err||'update ok.'
                        });
                    });
                }else{
                    sql.Page.create({
                        owner:req.body.owner||req.session.user.name,
                        name:req.body.name,
                        uri:req.body.uri,
                        type:req.body.type,
                        modules:JSON.parse(req,body.modules)
                    }, function(err){
                        res.json({
                            status:err||'create ok.'
                        });
                    });
                };
            });
        };
    }
};

exports.modules = function(req, res){
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
};
