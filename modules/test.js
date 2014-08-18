module.exports = function(re, owner, param, victim, share){
    this.name = 'test';
    this.author = 'quininer@live.com';
    this.description = 'This is an example of a test module';
    this.type = 'http';
    this.priority = 'Dealwith';
    // !Priority: 优先执行, Accepted: 接受信息, Dealwith: 处理信息, !Returns: 返回页面
    this.params = {
        'str':'String',
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
    //依赖，选择该模块后，必须选择另一模块

    return main(re, owner, str);
};

function main(re, owner, str){
    if(owner){return null};
    console.log(str+' '+re.q.host);
    console.log(str+' '+re.s.header('x','x'));
    return str;
};
