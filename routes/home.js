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
                //  owner, name, payload, load, modules
                req.body.owner&&(info.owner=req.body.owner);
                (name!=info.name)&&(info.name=name);
                req.body.payload&&(info.payload=req.body.payload);
                try{
                    req.body.load&&(info.load=JSON.parse(req.body.load));
                    req.body.modules&&(info.modules=JSON.parse(req.body.modules));
                }catch(err){
                    res.json({status:err});
                };
                info.save(function(err){
                    res.json({
                        status:err||'update ok.'
                    })
                });
            }else{
                //  owner, name, payload, load, modules
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
                //  owner, name, payload, load, modules, status
                req.body.owner&&(info.owner=req.body.owner);
                req.body.name&&(info.name=req.body.name);
                req.body.payload&&(info.payload=req.body.payload);
                try{
                    req.body.load&&(info.load=JSON.parse(req.body.load));
                    req.body.modules&&(info.modules=JSON.parse(req.body.modules));
                    req.body.status&&(info.status=JSON.parse(req.body.status));
                }catch(err){
                    res.json({status:err});
                };
                info.seva(function(err){
                    res.json({
                        status:err||'update ok.'
                    })
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
                    //  owner, name, uri, modules
                    req.body.owner&&(info.owner=req.body.owner);
                    req.body.name&&(info.name=req.body.name);
                    req.body.uri&&(info.uri=req.body.uri);
                    try{
                        req.body.modules&&(info.modules=JSON.parse(req.body.modules));
                    }catch(err){
                        res.json({status:err});
                    };
                    info.save(function(err){
                        res.json({
                            status:err||'update ok.'
                        });
                    });
                }else{
                    //  owner, name, uri, modules
                    sql.Page.create({
                        owner:req.body.owner||req.session.user.name,
                        name:req.body.name,
                        uri:req.body.uri,
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
    var path = fs.realpathSync('.');
    var json = {};
    if(type=='user'){
        //TODO
    }else if(type=='server'){

        fs.readdirSync('./modules').forEach(function(n){
            var m = require(path+'/modules/'+n+'/'+n);
            json[m.name] = {
                name:m.name,
                author:m.author,
                description:m.description,
                params:m.params
            };
        });
        return res.json(json);
    }else if(type=='victim'){
        //TODO
    }else{
        return err404(req, res);
    };
};
