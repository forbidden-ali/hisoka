/*
    TODO
        封装一些模块常用操作
        mod.js的目的不是用来完全代替原本的sql, req, res操作
            只是针对Hisoka一些特别的处理进行封装
            弥补原本的麻烦操作
*/

exports.sql = function(conf, name){
    var i = {
        owner:((conf.w === null)?true:false),
        add:function(data){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            conf.v.find({who:conf.w}, function(err, info){
                if(!info.status[name]){
                    info.status[name] = {};
                };
                for(var i in data){
                    (info.status[name][i])?(
                        info.status[name][i].unshift(data[i])):(
                        info.status[name][i] = [data[i],]);
                };
                info.save((typeof callback == 'function')&&callback);
            });
        },
        see:function(fname){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            conf.v.find({who:conf.w}, function(err, info){
                (typeof callback == 'function')&&callback(err, info.status[fname||name], info);
            });
        }
    };
    return i;
};
exports.re = function(re, ms, di){
    var i = {
        type:(((ms.g === null)&&(ms.o === null))?true:false),
        q:{
            accpet:(ms.g === null)?re.q.param('accept'):JSON.parse(ms.g)['accept'],
            query:function(name){
                var args = JSON.parse(re.q.query.args||'{}');
                return name?args[name]:args;
            },
            body:function(name){
                var args = JSON.parse(re.q.body.args||'{}');
                return name?args[name]:args;
            },
            args:function(name){
                var args = JSON.parse(((ms.g === null)?re.q.param('args'):JSON.parse(ms.g).args)||'{}');
                return name?args[name]:args;
            }
        },
        s:{
            send:function(data, tpl){
                i.type?re.s.send(JSON.stringify(data)):re.s.rander(di.r+(tpl||di.n), data);
            }
        }
    };
    return i;
};
