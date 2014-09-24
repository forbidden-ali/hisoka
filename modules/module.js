/*
    TODO
      封装一些模块常用操作
*/

exports.sql = function(conf, name){
    var m = {
        add:function(data, f){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            conf.v.find((f&&(typeof f == 'object'))?f:{who:conf.w}, function(err, info){
                if(!info.status[name]){
                    info.status[name] = {};
                };
                for(var i in data){
                    (info.status[name][i])?(
                        info.status[name][i].unshift(data[i])):(
                        info.status[name][i] = [data[i],]);
                };
                info.save((callback&&(typeof callback == 'function'))&&callback);
            });
        },
        see:function(){},
        pop:function(){}
    };
    return m;
};
