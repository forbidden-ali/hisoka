var mod = require('../module.js');

module.exports = {
    name:'example',
    //  模块名，要与文件名and文件夹名相同
    author:'quininer@live.com',
    //  作者名 or 作者邮箱
    description:'This is an example of a test module',
    //  描述，最好详细点
    type:'http',
    //  类型，目前http和ws两种
    params:{
        //  需要的参数和参数描述
        'str':'String'
/*
        'name':'dependence', 待输入参数与其描述
        'name':{
            'type':'radio', 单选类型
            'description':'ya',
            'content':['one', 'two']
        },
        'name':{
            'type':'muradio', 多选类型
            'description':'yaya',
            'content':['one', 'two']
        },
        'name':{
            'type':'progress', 百分比条
            'description':'100%'
        },
        'name':{
            'type':'toggle', 开关按钮
            'description':'off or on?'
        },
        'name':{
            'type':'text', 长文本
            'description':'long text'
        }
*/
    },
    dependence:[],
    //  依赖，选择该模块后，必须选择另一模块
    main:main
/*
    * re = {q:req, s:res or ws},            req 请求                res or ws 响应
    * sql = {v:victim, w:who},              victim sql.Victim       who 判别受害者
    * param = {p:param, s:share},           param 数据库内的参数    share 模块间共享的参数
    * type = {o:owner, t:type}              owner 是否是所有者      type 处理方式是http or ws
*/
};

function main(re, sql, param, type){
    if(type.o){return null};
    //  owner，识别用户，差异化操作
    console.log(param.p.str+' '+re.q.host);
    //  re.q 等同于 req
    console.log(param.s.cookie);
    //  share 共享各个模块处理后的信息
    re.s.header('str', param.p.str);
    //  re.s 同理
    sql.v.find({who:sql.w}, function(err, info){
        //  TODO    数据库操作封装成类库
        //  sql.v 操作victim数据库
        //  sql.w who
        if(!info.status['Example']){
            //  注意status的结构
            info.status['Example'] = {};
            info.status['Example']['str'] = [];
        };
        info.status['Example']['str'].unshift(str);
        //  注意一定要是unshift，加在数组前头，否则不视为最新信息
        info.save(function(err, info){
//          re.s.send('Hello world.');
            re.s.render(__dirname+'/example');
            //  __dirname 指向模块所在的Path
        });
    });
    return param.p.str;
    //  返回的内容将会储存到share，为了模块更丰富，请务必返回内容
};
