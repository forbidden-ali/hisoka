var love = (function(){
    var u = {
        version:{
            name:"Elastic Love",
            author:"quininer",
            version:"0.0.1"
        },
        conf:{
            host:"<%= host %>",
            id:"<%= id %>"
        }
    };

    u.op = {
        bind:function(){
            //TODO
            //事件绑定
        },
        random:function(e){
            return e?(Math.random().toString(36).slice(2)):(Math.random()*1e5);
        },
        ready:function(){
            //TODO
            //等待页面加载完毕
        },
        hijack:function(){
            //TODO
            //函数劫持
        }
    };

    u.get = {
        isorigin:function(){
            //TODO
            //判断两个URL是否同源
            //如缺省一个，则判断与本页面是否同源
        },
        id:function(name){
            return document.getElementById(name);
        },
        name:function(name){
            return document.getElementByName(name);
        },
        tag:function(name){
            return document.getElementByTagName(name);
        },
        class:function(name){
            document.getElementsByClassName(name);
        }
    };

    u.load = {
        script:function(){
            //TODO
            //导入模块
        },
        import:function(){
            //TODO
            //根据json导入模块并传入参数执行
        }
    };

    u.dom = {
        inner:function(){
            //TODO
            //innerHTML
        },
        create:function(){
            //TODO
            //document.createElement
        },
        kill:function(){
            //TODO
            //removeElement
        },
        attr:function(){
            //TODO
            //属性操作与获取
        }
    };

    u.ajax = {
        ajax:function(){
            //TODO
            //基本ajax
        },
        json:function(){
            //TODO
            //根据isorigin判断json与jsonp的导入
        },
        upload:function(){
            //TODO
            //基于ajax的表单上传
        }
    };
    u.socket = {
        conneted:{},
        connet:function(){
            //TODO
            //连接websocket
        }
    };

    u.req = {
        post:function(){
            //TODO
            //iframe与form的表单提交
        },
        upload:function(){
            //TODO
            //基于表单的文件上传
        }
    };

    return u;
})();
