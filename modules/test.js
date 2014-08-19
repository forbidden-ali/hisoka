module.exports = function(re, owner, param, victim, who, share){
    this.name = 'test';
    //  模块名，要与文件名相同
    this.author = 'quininer@live.com';
    //  作者名 or 作者邮箱
    this.description = 'This is an example of a test module';
    //  描述，最好详细点
    this.type = 'http';
    //  类型，目前http和ws两种
    this.params = {
        //  需要的参数和参数描述
        'str':'String'
        //'name':'dependence', 待输入参数与其描述
        //'name':{
        //    'type':'radio', 单选类型
        //    'description':'ya',
        //    'content':['one', 'two']
        //},
        //'name':{
        //    'type':'muradio', 多选类型
        //    'description':'yaya',
        //    'content':['one', 'two']
        //},
        //'name':{
        //    'type':'progress', 百分比条
        //    'description':'100%'
        //},
        //'name':{
        //    'type':'toggle', 开关按钮
        //    'description':'off or on?'
        //},
        //'name':{
        //    'type':'text', 长文本
        //    'description':'long text'
        //}
    };
    this.dependence = [];
    //  依赖，选择该模块后，必须选择另一模块

    return main(re, owner, param.str, {v:victim, w:who}, share);
};

function main(re, owner, str, sql, share){
    if(owner){return null};
    //  owner，识别用户，差异化操作
    console.log(str+' '+re.q.host);
    //  re.q 等同于 req
    console.log(share.cookie);
    //  share 共享各个模块处理后的信息
    re.s.header('str', str);
    //  re.s 同理
    sql.v.find({who:sql.w}, function(err, info){
        //  sql.v 操作victim数据库
        //  sql.w who
        var status = info.status;
        if(!status['Test']){
            //  注意status的结构
            status['Test'] = {};
            status['Test']['str'] = [];
        };
        status['Test']['str'].unshift(str);
        //  注意一定要是unshift，加在数组前头，否则不视为最新信息
        sql.v.findByIdUpdate(info._id, {
            status:status
        }, function(err, info){
            re.s.send('Hello world.');
            return str;
            //  返回的内容将会储存到share，为了插件更丰富，请务必返回内容
        });
    });
};
