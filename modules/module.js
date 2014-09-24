/*
    TODO
      封装一些模块常用操作
*/

exports.sql = function(conf, name){
    var i = {
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
                (typeof callback == 'function')&&callback(err, info.status[fname||name]);
            });
        }
    };
    return i;
};
exports.re = function(re, type){
    var i = {
        q:{
            //TODO
        },
        s:{
            send:function(data, tpl){
                (type.t == 'ws')?re.s.send(data):re.s.rander(type.p+(tpl||type.n), data);
            }
        }
    };
    return i;
};
