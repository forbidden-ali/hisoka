/*
    封装一些模块常用操作
    mod.js的目的不是用来完全代替原本的sql, req, res操作
        只是针对Hisoka一些特别的处理进行封装
        弥补原本的麻烦操作
*/

exports.sql = function(conf, name){
    /*
    *   封装Mod内的SQL操作
    *   args:
    *       @conf   Object, {w:[who String], v:[mongoose Object]}
    *       @name   String, Mod Name
    *   attr:
    *       @owner  Boolean
    */
    var i = {
        owner:((conf.w === null)?true:false),
        add:function(data){
            /*
            *   往数据库内添加数据
            *   args:
            *       @data   Object, {[name String]:[value String], ...}
            *   callback:
            *       @err    Error
            *       @info   Object
            */
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
            /*
            *   查询数据
            *   args:
            *       @fname  String, Mod Name
            *   callback:
            *       @err    Error
            *       @info   Object, 数据库内的模块配置
            */
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            conf.v.find({who:conf.w}, function(err, info){
                (typeof callback == 'function')&&callback(err, info.status[fname||name], info);
            });
        }
    };
    return i;
};
exports.re = function(re, ms, di){
    /*
    *   封装请求和响应的操作
    *   args:
    *       @re Object, 懒得描述了，记得把这几个参数传进来就对了
    *       @ms Objetc
    *       @di Objetc
    *   attr:
    *       @type   Boolean, 是否是HTTP类型的请求
    *
    */
    var i = {
        type:(((ms.g === null)&&(ms.o === null))?true:false),
        q:{
            /*
            *   attr:
            *       @accept List, 获取希望处理该信息的Mod列表
            *       @query  Object, 获取query中的参数 *only HTTP
            *       @body   Object, 获取body中的参数 *only HTTP
            */
            accept:(ms.g === null)?re.q.param('accept'):JSON.parse(ms.g)['accept'],
            query:JSON.parse(re.q.query.args||'{}'),
            body:JSON.parse(re.q.body.args||'{}'),
            args:function(name){
                /*
                *   通用的获取参数方法
                *   args:
                *       @name   String, 参数名，若为空则返回整个参数字典
                *   return:
                *       @args   String or Object or undefined
                *
                */
                var args = JSON.parse(((ms.g === null)?re.q.param('args'):JSON.parse(ms.g).args)||'{}');
                return name?args[name]:args;
            }
        },
        s:{
            send:function(data, tpl){
                /*
                *   通用的发送信息方法
                *   args:
                *       @data   Object, 需要返回的对象
                *       @tpl    String, 可以指定模板，默认使用与Mod同名的模板 *only HTTP
                */
                return i.type?re.s.send(JSON.stringify(data)):re.s.rander(di.r+(tpl||di.n), data);
            }
        }
    };
    return i;
};

exports.op = {
    /*
    *   封装一些常用操作，比如
    *       数组去重
    */
    unique:function(arr){
        //  Array 元素去重
        var ret = [];
        for(var i in arr){
            var item = arr[i];
            if(ret.indexOf(item) === -1)ret.push(item);
        };
        return ret;
    },
};
