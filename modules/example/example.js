var mod = require('../module.js');
var readme = require('./readme.json');

module.exports = function(Re, Sql, Param, Type){
    /*
    * Re = {q:req, s:res or ws},            req 请求                res or ws 响应
    * Sql = {v:victim, w:who},              victim sql.Victim       who 判别受害者
    * Param = {p:param, s:share},           param 模块的参数        share 模块间共享的参数
    * Type = {o:owner, t:type}              owner 是否是所有者      type 处理方式是http or ws
    */
    if(Type.o)return null;//                        owner，识别用户，差异化操作
    var sql = mod.sql(Sql, readme.name);//          mod模块，封装一些关于模块的操作，此处关于数据库
    console.log(Param.p.str+' '+Re.q.host);//       re.q 等同于 req
    Re.s.header('str', Param.p.str);//              re.s 同理
    console.log(Param.s.cookie);//                  share 共享各个模块处理后的信息
    sql.add({
        str:Param.p.str
    }, function(){
        Re.s.rander(__dirname+'/example');
    });
    return Param.p.str;//                   返回的内容将会储存到share，为了模块更丰富，请务必返回内容
};
