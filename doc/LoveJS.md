LoveJS Document
===============

`love.js`篇幅可能比较长，还是独立出来比较好。

为了方便编写 Vmod，Hisoka封装了一个利用框架，称作`love.js`(伸缩自在的爱)。

**以下参数名后带`*`的，为必填参数**

love.conf
---------
关于一些可能会用到的配置

    conf:{
        protocol:[str],     //  指定与Hisoka通信是否通过ssl，虽然一般情况缺省协议就可以了
        host:[str],         //  Hisoka所在的主机，包括端口                  eg: localhost:80
        id:[str]            //  判断处理入口的ID，不是很需要了解的东西      eg: "1"
    },


love.req
--------
关于请求的封装，子类有
[ajax](#ajaxfunction)，
[json](#jsonfunction)，
[post](#postfunction)，
[infoback](#infobackfunction)

### ajax:[function]
封装了xhr操作

- @param - url, datas, headers, nsync, callback
- url*    - 目标的URL，需要是一个合法的URL字符串                eg: `/index.html`
- datas   - body内容，可以是字符串或是object字典                eg: `{"hello":"world."}`
- headers - 需要添加的请求头                                    eg: `{"Client-IP":"127.0.0.1"}`
- nsync   - 是否不使用同步xhr                                   eg: `true`
- callback - 如果最后一个参数是function，将会当作回调函数执行   eg: `function(xhr){console.log(xhr.currentTarget.responseText)}`

```
    >love.req.ajax('/post').responseText;
    Need POST!
    >love.req.ajax('/post', {"hello":"world."}).responseText;
    hello world.
    >love.req.ajax('/post', {"hello":"world."}, {"X-Forwarded-For":"127.0.0.1", "Content-Type":"application/x-www-form-urlencoded"}, false, function(xhr){console.log(xhr.currentTarget.responseText)});
    hello world.
    XMLHttpRequest
```

**love.req.ajax回调函数的参数是XMLHttpRequestProgressEvent，而非XMLHttpRequest，需要注意。**
**另一点需要注意的是，如果有headers，则不会默认带上Content-Type Headers**

### json:[function]
简化了json和jsonp的操作

- @param - url, callname, callback
- url*        - json或jsonp的地址，需要是一个URL字符串   eg: `/hi.json`
- callname    - 当指定了回调名时，执行jsonp操作，需要同时指定callback，且只能异步操作，没有返回 eg: `callback`
- callback    - 回调函数的参数即是json                   eg: `function(json){console.log(json)}`

```
    >love.req.json('/hi.json');
    Object {hello: "world."}
    >love.req.json('/hi.jsonp', 'callback', function(json){console.log(json)});
    Object {hello: "world."}
```

### post:[function]
使用form实现的表单提交

- @param - url, datas, jump, callback
- url*    - action地址                                        eg: `/post.php`
- datas   - 一个object字典                                    eg: `{"hello":"world."}`
- jump    - 是否跳转，当不需要使用iframe实现不刷新时可以打开  eg: `true`
- callback - 回调函数

```
    >love.req.post('/404');
    undefined
    POST http://quininer.ml/xxx 404 (Not Found)
    >love.req.post('/post', {"hello":"world."}, false, function(){console.log(1)});
    1
    undefined
```
**注意一下，form实现的表单提交，提交时一般在浏览的状态栏会限制action地址之类的，非必要情况建议用ajax代替**

### infoback:[function]
将信息回传给Hisoka的封装

- @param - uri, accept, args
- uri*    - 指定接收的Page所在的URI.                          eg: `auto`
- accept* - 指定希望处理该信息的Page模块，需要是个Array       eg: `['autoinfo']`
- args*   - 需要回传的参数们，是个object                      eg: `"hello":"world."}`

```
    >love.req.infoback('attack', ['autoinfo'], {"Cookie":document.cookie});
    undefined
```
**需要注意，infoback原则上是用来回传信息的，所以没有回调函数**


love.load
---------
关于模块加载的封装，子类有
[script](#scriptfunction)，
[import](#importfunction)

### script:[function]
单独导入一个JavaScript文件

- @param - url, callback
- url*        - JavaScript file URL.  eg: `/hi.js`
- callback    - onload实现的回调函数  eg: `function(){console.log('hi')}`
```
    >love.load.script('/alert.js', function(){console.log(1)});
    undefined
    // alert 弹出
    1
```

### import:[function]
导入多个modules

- @param - loads
- loads*  - 是个object字典，键名为URL，键值为modules的参数，也是个object字典    eg: `{"example":{"hello":"world."}}`
```
    >love.load.import({"cutimg":{"uri":"auto"}});
    undefined
```
**当键名不带"/"时，会自动补全成Hisoka的modules地址**
**同样，原则上仅用来导入模块，没有回调函数**


love.dom
--------
关于DOM操作的封装，子类有
[inner](#innerfunction)，
[add](#addfunction)，
[create](#createfunction)，
[insert](#insertfunction)，
[kill](#killfunction)，
[attr](#attrfunction)

### inner:[function]
用innerHTML方法插入HTML代码。

- @param - dom, hide, e, callback
- dom*      - 需要inner的HTML内容                                   eg: `'<img src=#>'`
- hide      - 是否隐藏式，若启用，则inner的元素不会显示在页面上     eg: `true`
- e         - 父元素                                                eg: `love.get.id('hi')`
- callback  - 回调函数，参数为inner创建的元素
```
    >love.dom.inner('<img src=# onerror=alert(1)>', true, love.get.body, function(){console.log(1)});
    <img src="#" onerror="alert(1)" style="display: none">
    1
    // 弹出 alert(1)
```
**注意，inner一次只能插入一个元素，若要插入多个元素，还请用原生的innerHTML**
**inner插入script tag是不起效的，还请用add**

### add:[function]
使用DOM方法插入元素
是对love.dom.create和love.dom.insert的封装

- @param - tag, attr, parent, callback
- tag*      - 标签名                                eg: `'img'`
- attr      - 属性，需要是个object `{}`             eg: `{"src":"#"}`
- parent    - 父元素                                eg: `love.get.id('hi')`
- callback  - 回调函数，参数为创建的元素和父元素    eg: `function(e, parent){console.log(e, parent)}`
```
    >love.dom.add('img', {"src":"/img.png"}, love.get.body, function(e, parent){console.log(parent)});
    <img src="/img.png">
    <body></body>
```

### create:[function]
创建元素

- @param - tag, attr
- tag*  - 标签名    eg: `'img'`
- attr  - 属性      eg: `{"src":"#"}`
```
    >love.dom.create('img', {"src":"/img.png"});
    <img src="/img.png">
```
**create只是创建了一个元素，并未插入DOM树**

### insert:[function]
插入元素

- @param - e, parent, callback
- e*        - DOM元素   eg: `love.dom.create('img')`
- parent    - 父元素    eg: `love.get.body`
- callback  - 回调函数，参数为创建的元素和父元素
```
    >love.dom.insert(love.dom.create('img', {"src":"/img.png"}), function(e, parent){console.log(parent)});
    <img src="/img.png">
    <body></body>
```
**insert的回调函数是在生成DOM之后执行，不是等待DOM加载完后执行**

### kill:[function]
从DOM里删除元素

- @param - e, callback
- e*        - 元素，必须在DOM中     eg: `love.get.tag('a')[0]`
- callback  - 回调函数，没有参数
```
    >love.dom.kill(love.get.tab('img')[0], function(){console.log(1)});
    undefined
    1
```
**要删除的DOM元素必须要有父元素**

### attr:[function]
获取或设置某元素的属性

- @param - e, attr, value
- e*    - 元素                                                      eg: `love.get.tag('img')[0]`
- attr* - 属性名，如果未设置value，那么会返回该属性已设置的属性值   eg: `src'`
- value - 值                                                        eg: `'#'`
```
    >love.dom.attr(love.get.tag('img')[0], 'src');
    "#"
    >love.dom.attr(love.get.tag('img')[0], 'src', '/img.png');
    <img src="/img.png" onerror="alert(1)" style="display: none">
```


love.get
--------
上面也有用到一些`love.get`的内容，
是对获取信息的一些封装，
子类有
[isorigin](#isoriginfunction)，
[protocol](#protocolstr)，
[isdom](#isdomfunction)，
[id](#idnametagclassfunction)，
[name](#idnametagclassfunction)，
[tag](#idnametagclassfunction)，
[class](#idnametagclassfunction)，
[html](#htmlheadbodyfunction)，
[head](#htmlheadbodyfunction)，
[body](#htmlheadbodyfunction)，
[testorigin](#testoriginfunciton)

### isorigin:[function]
判断一个URL是否和当前域同源 or 判断两个URL是否同源

- @param - url, url2
- url*/url2  - 字符串    eg: `'http://localhost/'`
```
    >love.get.isorigin('http://localhost/test');
    true
    >love.get.isorigin('http://localhost/test', 'http://quininer.ml:80/tests/alert.html');
    false
```

### protocol:[str]
当前建议使用的HTTP协议
若要ajax之类时，确定HTTP协议只需要
```
    love.get.protocol+'//localhost/'
```

### isdom:[function]
判断参数是否是DOM元素

- @param - e
- e* - *          eg: `'AAAA'`
```
    >love.get.isdom(love.get.id('hi'));
    true
```

### testorigin:[function]
使用ajax测试某个URL和当前域是否同源

- @param - url
- url* - 字符串      eg: `'http://localhost/'`
```
    >love.get.testorigin('http://localhost/');
    true
```

### id,name,tag,class:[function]
对获取DOM元素的封装

- @param - name
- name* - id名之类的     eg: `'a'`
```
    >love.get.id('hi');
    <div id="hi"></div>
    >love.get.tag('img')[0];
    <img src="/img.png" onerror="alert(1)" style="display: none">
```
**需要注意，id方法返回的是单个DOM元素，而其他则是返回一个Array**

### html,head,body:[function]
返回对应的DOM元素，
```
    >love.get.html() === love.get.tag('html')[0]
    true
```

love.op
-------
关于JavaScript的一些封装，
子类有
[bind](#bindfunction)，
[random](#randomfunction)，
[hook](#hookfunction)，
[ready](#readyfunction)

### bind:[function]
关于绑定事件的封装

- @param - e, name, foo
- e*     - DOM元素   eg: `love.dom.create('img')`
- name*  - 事件名    eg: `'load'`
- foo*   - 事件函数  eg: `function(e){console.log(e)}`
```
    >love.op.bind(love.get.tag('img')[0], 'load', function(e){console.log(1)});
    undefined
    >love.dom.attr(love.get.tag('img')[0], 'src', '/img.png');
    <img src="/img.png" onerror="alert(1)" style="display: none">
    1
```

### random:[function]
关于获取随机数的封装

- @param - i
- i* - 获取随机数的类型，一般来说无需关心  eg: `true`
```
    > love.op.random(false);
    85114.78146538138
    > love.op.random(true);
    "zb4kbg00tzm8ia4i"
```

### hook:[function]
关于函数钩子的实现

- @param - foo, hook
- foo* - 原函数，或是其他函数    eg: `alert`
- hook - 钩子函数               eg: `function(foo_alert, str){console.log(str), foo_alert(str)}`

foo函数将会作为hook函数的第一个参数传入，而被hook的函数接收到的参数将会排在foo之后传如hook。
```
    >alert = love.op.hook(alert, function(foo, str){console.log(str), foo(str)});
    function (){
        return (typeof hook == 'function')?(
            Array.prototype.unshift.call(arguments, foo),
            hook.apply(this, arguments)
        ):foo.apply(this, arguments);
    }
    >alert(1);
    1
    // alert(1) 弹出
```

若没有hook函数，那么全部参数将由foo接管
```
    >alert = love.op.hook(console.log);
    function (){
        return (typeof hook == 'function')?(
            Array.prototype.unshift.call(arguments, foo),
            hook.apply(this, arguments)
        ):foo.apply(this, arguments);
    }
    >alert(1);
    1
    // 没有弹出 alert(1)
```
**注意alert前面不要有声明局部变量的var**

### ready:[function]
等待DOM加载完成之后执行某函数

- @param - foo
- foo* - 待执行函数  eg: `function(){alert('DOM加载完啦')}`


love.socket
-----------
关于WebSocket的封装，
子类有
[connet](#connetfunction)

### connet:[funcction]
连接到一个connet，将链接对象保存到`love.socket.conneted`

- @param - ws
- ws* - ws链接      eg: `'ws://localhost/wstest'`
```
    >love.socket.connet('ws://localhost/wstest');
    undefined
    >love.socket.conneted
    Object {ws://localhost/wstest: WebSocketObject}
```

love.run
--------
一些运行时的配置，
大概有
[jsonp](#jsonpobject)，
[args](#argsobject)，
[foo](#fooobject)

### jsonp:[object]
临时保存jsonp回调函数的地方
一般来说，无需关心

### args:[object]
临时保存模块参数的地方，结构为
```
    (love.run.args){
        (Vmod name){...}
    }
```

### foo:[object]
保存模块函数的地方，可供再次调用
```
    >love.run.foo.cutimg('auto');
    undefined
```

----------------------------------------

# 大概写完了吧？以后有功能添加或更改再继续写
