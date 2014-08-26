var love = {
    version:{
        name:"Elastic Love",
        author:"quininer",
        version:"0.0.1"
    },
    conf:{
        host:"<%= host %>",
        id:"<%= id %>"
    },

    load:{
        script:function(){
            //TODO
            //导入模块
        },
        import:function(){
            //TODO
            //根据json导入模块并传入参数执行
        }
    },

    dom:{
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
    },

    ajax:{
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
    },
    socket:{
        conneted:{},
        connet:function(){
            //TODO
            //连接websocket
        }
    },

    req:{
        post:function(){
            //TODO
            //iframe与form的表单提交
        },
        upload:function(){
            //TODO
            //基于表单的文件上传
        }
    },

    get:{
        isorigin:function(){
            //TODO
            //判断两个URL是否同源
            //如缺省一个，则判断与本页面是否同源
        },
        id:function(){},
        name:function(){}
    },

    op:{
        bind:function(){
            //TODO
            //事件绑定
        },
        random:function(){
            //TODO
            //返回一个随机数
            //or 返回一个随机字符
        },
        ready:function(){
            //TODO
            //等待页面加载完毕
        },
        hijack:function(){
            //TODO
            //函数劫持
        }
    },

    main:function(){
        //TODO
    }
};

love.main();
