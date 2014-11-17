var express = require('express'),
    router = express.Router();

router.post('/logout', function(req, res){
    req.session.user = null;
    res.redirect('/login');
});

// TODO 看之后前端怎么写，再来写接口吧

router.get('/', function(req, res){
    var victim, page;
    sql.Victim.find({}, function(err, info){
        victims = info;
        sql.Page.find({}, function(err, info){
            pages = info;
            sql.Item.find({}, function(err, info){
                items = info;
                res.render('home', {
                    items:items,
                    victims:victims,
                    pages:pages
                });
            });
        });
    });
});

router.get('/item/:name', function(req, res){
    sql.Item.findOne({id:req.params.name}, function(err, info){
        if(!info)return err404(req, res);
        res.render('edit', {
            items:info
        });
    });
});
router.post('/item/:name/edit', function(req, res){
    var name = req.params.name;
    if(!name)return res.json({err:'error, name?'});
    sql.Item.findOne({name:name}, function(err, info){
        if(info){
            //  name, payload, load, modules
            (name!=info.name)&&(info.name=name);
            req.body.payload&&(info.payload=req.body.payload);
            try{
                req.body.load&&(info.load=JSON.parse(req.body.load));
                req.body.modules&&(info.modules=JSON.parse(req.body.modules));
            }catch(err){
                res.json({err:err});
            };
            info.save(function(err){
                res.json({err:err});
            });
        }else{
            //  name, payload, load, modules
            sql.Item.create({
                name:name,
                payload:req.body.payload,
                load:JSON.parse(req.body.load),
                modules:JSON.parse(req.body.modules)
            }, function(err){
                res.json({err:err});
            });
        };
    });
});

router.get('/victim/:name', function(req, res){
    sql.Victim.findOne({id:req.params.name}, function(err, info){
        if(!info)return err404(req, res);
        res.render('edit', {
            victims:info
        });
    });
});
router.post('/victim/:name/edit', function(req, res){
    var id = req.params.id;
    if(req.param('type')=='delete'){
        sql.Victim.remove({_id:id}, function(err){
            res.json({err:err});
        });
    }else{
        sql.Victim.find({_id:id}, function(err, info){
            if(!info)return err404(req, res);
            //  name, payload, load, modules, status
            req.body.name&&(info.name=req.body.name);
            req.body.payload&&(info.payload=req.body.payload);
            try{
                req.body.load&&(info.load=JSON.parse(req.body.load));
                req.body.modules&&(info.modules=JSON.parse(req.body.modules));
                req.body.status&&(info.status=JSON.parse(req.body.status));
            }catch(err){
                res.json({err:err});
            };
            info.seva(function(err){
                res.json({err:err});
            });
        });
    };
});

router.get('/page/:uri/editor', function(req, res){
    sql.Page.findOne({uri:req.params.uri}, function(err, info){
        if(!info)return err404(req, res);
        return res.render('editpage', {
            pages:info
        });
    });
});
router.post('/page/:uri/edit', function(req, res){
    var id = req.params.id;
    if(req.param('type')=='delete'){
        sql.Page.remove({_id:id}, function(err){
            res.json({err:err});
        });
    }else{
        sql.Page.findOne({_id:id}, function(err, info){
            if(info){
                //  name, uri, modules
                req.body.name&&(info.name=req.body.name);
                req.body.uri&&(info.uri=req.body.uri);
                try{
                    req.body.modules&&(info.modules=JSON.parse(req.body.modules));
                }catch(err){
                    res.json({err:err});
                };
                info.save(function(err){
                    res.json({err:err});
                });
            }else{
                //  name, uri, modules
                sql.Page.create({
                    name:req.body.name,
                    uri:req.body.uri,
                    modules:JSON.parse(req,body.modules)
                }, function(err){
                    res.json({err:err});
                });
            };
        });
    };
});

router.all('/modules/:type', function(req, res){
    var type = req.params.type;
    var lists = {};
    var path = (
            (type=='server'&&(/\.|\/|\\/.test(name)))?
            ('./modules'):
            (
                (type=='victim'&&(/\.|\/|\\/.test(name)))?
                ('./static/modules'):
                (null)));
    try{
        if(!path)throw 'path error.';
        for(var e in fs.readdirSync(path)){
            lists[e] = fs.lstatSync(path+'/'+e).isDirectory()?true:false;
        };
    }catch(e){
        lists = {'err':404};
    };
    return res.json(lists);
});
router.all('/modules/:type/:name', function(req, res){
    var type = req.params.type;
    var name = req.params.name;
    var details;
    var path = (
            (type=='server'&&(/\.|\/|\\/.test(name)))?
            ('./modules/'+name+'/readme.json'):
            (
                (type=='victim'&&(/\.|\/|\\/.test(name)))?
                ('./static/modules/'+name+'/readme.json'):
                (null)));
    try{
        if(!path)throw 'path error.';
        details = require(path);
    }catch(e){
        details = {'err':404};
    };
    return res.json(details);
})

exports.router = router;
