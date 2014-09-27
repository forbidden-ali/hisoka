Hisoka Mod Document
===================

一个框架没有模块什么都干不了，大概。

## Victim Mod.

是单纯的 JavaScript 。
在 Victim 的浏览器上执行，然后与 Hisoka 通信。
后文简称 Vmod。

### readme.json

它在`./static/modules`里，每个 Vmod 拥有一个独立的目录和 readme.json，以及 Vmod 本身，
readme.json 是一个标准的JSON文件，保存着供用户阅读和处理的信息。

Hisoka 提供了一个 example, `./static/modules/example`

    {
        "name":"example",                       //  Vmod的名字，必须要与Vmod以及Vmod的目录名一致
        "author":"quininer",                    //  作者的名字或是邮箱
        "description":"演示一个最简单的模块",   //  一个简介
        "args":{                                //  需要用户填写的参数
            "example":"单纯的例子"              //  参数名 对应 参数简介
            "example2":{                        //  如果键值是一个Object，那么
                "type":"lists",                 //  会将按照type键来处理
                "args":{                        //  args键里的内容将会当作待填写的参数
                    "example":"子参数"
                }
            }
        }
    }

大概如此。。

### love.js

为了方便编写 Vmod，Hisoka封装了一个利用框架，称作 love.js (伸缩自在的爱)。

#### love.conf

    conf:{
        protocol:[str],     //  指定与Hisoka通信是否通过ssl，虽然一般情况缺省协议就可以了
        host:[str],         //  Hisoka所在的主机，包括端口                  eg: localhost:80
        id:[str]            //  判断处理入口的ID，不是很需要了解的东西      eg: "1"
    },

#### love.req

    req:{
        ajax:[function],
        /*
            封装了xhr操作
            @param - url, datas, headers, nsync, callback
                url     - 目标的URL，需要是一个合法的URL字符串  eg: /index.html
                datas   - body内容，可以是字符串或是object字典  eg: {"hello":"world."}
                headers - 需要添加的请求头                      eg: {"Client-IP":"127.0.0.1"}
                nsync   - 是否不使用同步xhr                     eg: true
                callback - 如果最后一个参数是function，将会当作回调函数执行
                    *love.req.ajax回调函数的参数是XMLHttpRequestProgressEvent，
                    而非XMLHttpRequest，需要注意。              eg: function(xhr){console.log(xhr.currentTarget.responseText)}
        */
        json:[function],
        /*
            简化了json和jsonp的操作
            @param - url, callname, callback
                url      - json或jsonp的地址，需要是一个URL字符串   eg: /hi.json
                callname - 当指定了回调名时，会当作jsonp操作，
                    需要同时指定callback，且只能异步操作，没有返回  eg: callback
                callback - 回调函数的参数即是json                   eg: function(json){console.log(json)}
        */
        post:[function],
        /*
            使用form实现的表单提交
            @param - url, datas, jump, callback
                url     - action地址                                        eg: /post.php
                datas   - 一个object字典                                    eg: {"hello":"world."}
                jump    - 是否跳转，当不需要使用iframe实现不刷新时可以打开  eg: true
                callback - 回调函数
        */
        infoback:[function]
        /*
            将信息回传给Hisoka的封装
            @param - uri, accept, args
                uri     - 指定接收的Page所在的URI.                          eg: auto
                accept  - 指定希望处理该信息的Page模块，需要是个Array       eg: ['autoinfo']
                args    - 需要回传的参数们，是个object                      eg: {"hello":"world."}
                    *需要注意，infoback原则上是用来回传信息的，所以没有回调函数
        */

    }

#### love.load

    load:{
        script:[function],
        /*
            单独导入一个JavaScript文件
            @param - url, callback
                url         - JavaScript file URL.  eg: /hi.js
                callback    - onload实现的回调函数  eg: function(){console.log('hi')}
        */
        import:[function]
        /*
            导入多个modules
            @param - loads
                loads - 是个object字典，键名为URL，键值为modules的参数，也是个object字典
                    *当键名不带"/"时，会自动补全成Hisoka的modules地址
                    *同样，原则上仅用来导入模块，没有回调函数
                                            eg: {"example":{"hello":"world."}}
        */
    }

**TODO**
