var mod = require('../module.js');
var readme = require('./readme.json');

module.exports = function(re, us, pa, ms){
    /*
    * re = {q:req, s:res or ws},            req 请求对象            res or ws 响应对象
    * us = {v:victim, w:who},               victim sql.Victim       who 判断身份
    * pa = {p:param, s:share},              param 模块预设的参数    share 模块间共享的参数
    * ms = {o:wss, g:type}                  wss ws的连接集          type 处理方式是http or ws
    */
    var msql = new mod.sql(us, readme.name);//      mod模块，封装一些关于模块的操作，此处关于数据库
                                            //      此处的new是多余的，不过为了表达这是一个类，加上也无妨
    var mre = new mod.re(re, ms, {n:readme.name, r:__dirname});//   关于请求响应的封装
    if(msql.owner)return null;//                    owner，识别用户，差异化操作

    console.log(pa.p.str, re.q.get('referer'));//   re.q 等同于 req
    console.log(pa.s.cookie[0]);//                  share 共享各个模块处理后的信息
    re.s.header(mre.q.args().str, pa.p.str);//      re.s 同理，mre.q封装了请求，简化参数

    msql.add({
        str:pa.p.str//                  封装数据库操作
    }, function(){
        mre.s.send({'str':pa.p.str});// 封装了响应，根据不同type返回，第二个参数在type时会指定模板
    });

    return pa.p.str;//                  返回的内容将会储存到share，为了模块更丰富，请务必返回内容
};
