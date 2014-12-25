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


love.code
---------
关于编码的封装，方法有
+ [urlen](#urlenfunction)
+ [quote](#quotefunction)

### urlen:[function]
封装了urlencode操作

|Params | Description   | Type      | Example
|-------|---------------|-----------|--------------
|datas  | ..            | Object    | `{"AA":"BB"}`

|Return Description | Type
|-------------------|-------
|urlencode后的返回  | String

```
    >love.code.urlen({"AA":"BB", "CC":"DD"})
    "AA=BB&CC=DD"
```

### quote:[function]
完全的encodeURL编码

|Params | Description       | Type     | Example
|-------|-------------------|----------|--------
|num*   | 需要编码的字符    | String   | `AAA();`

|Return Description     | Type
|-----------------------|------
|encodeURL后的返回      | String

```
    >love.code.quote('AAA();')
    "%41%41%41%28%29%3B"
```

love.req
--------
关于请求的封装，方法有
+ [ajax](#ajaxfunction)，
+ [json](#jsonfunction)，
+ [post](#postfunction)，
+ [infoback](#infobackfunction)

### ajax:[function]
封装了xhr操作

|Params     | Description           | Type              | Example
|-----------|-----------------------|-------------------|---------------------------
|url*       | 请求目标的URL         | String            | `/index.html`
|datas      | body内容              | String or Object  | `{"hello":"world."}`
|headers    | 需要添加的请求头      | Object            | `{"Client-IP":"127.0.0.1"}`
|nsync      | 不使用同步xhr         | Bool              | `true`
|ijson      | POST内容使用JSON格式  | Bool              | `true`

|Callback Param                 | Type      | Example
|-------------------------------|-----------|---------------------------------
|XMLHttpRequestProgressEvent    | Object    | `xhr.currentTarget.responseText`

|Return Description | Type
|-------------------|--------
|XMLHttpRequest     | Object

```
    >love.req.ajax('/post').responseText;
    Need POST!
    >love.req.ajax('/post', {"hello":"world."}).responseText;
    hello world.
    >love.req.ajax('/post', {"HELLO":"WORLD."}, {"X-Forwarded-For":"127.0.0.1", "Content-Type":"application/x-www-form-urlencoded"}, false, function(xhr){console.log(xhr.currentTarget.responseText)});
    HELLO WORLD.
    XMLHttpRequest
```

* 有Callback列表的方法，若最后一个参数是函数，则会将该参数当作回调函数使用
* love.req.ajax回调函数的参数是XMLHttpRequestProgressEvent，而非XMLHttpRequest，需要注意。
* 另一点需要注意的是，如果有headers，则不会默认带上Content-Type Headers

### json:[function]
简化了json和jsonp的操作

|Params     | Description                                                                   | Type      | Example
|-----------|-------------------------------------------------------------------------------|-----------|------------
|url*       | json或jsonp的地址                                                             | String    | `/hi.json`
|callname   | 当指定了回调名执行jsonp操作，需要同时指定callback，且只能异步操作，没有返回   | String    | `callback`

|Callback Params    | Type
|-------------------|--------
|json               | Object

|Return Description                 | Type
|-----------------------------------|--------
|json，若指定了callname，则没有返回 | Object

```
    >love.req.json('/hi.json');
    Object {hello: "world."}
    >love.req.json('/hi.jsonp', 'callback', function(json){console.log(json)});
    Object {hello: "world."}
```

### post:[function]
使用form实现的表单提交

|Params | Description   | Type      | Example
|-------|---------------|-----------|---------------------
|url*   | action地址    | String    | `/post.do`
|datas  | POST内容      | Object    | `{"Hello":"world."}`
|jump   | 跳转页面      | Bool      | `true`

|Callback Param | Type
|---------------|------
|Null           | Null

```
    >love.req.post('/404');
    undefined
    POST http://localhost/404 404 (Not Found)
    >love.req.post('/post', {"hello":"world."}, false, function(){console.log(1)});
    1
    undefined
```
* 注意一下，form实现的表单提交，提交时一般在浏览的状态栏会显示action地址之类的，非必要情况建议用ajax代替

### infoback:[function]
将信息回传给Hisoka的封装

|Params | Description                   | Type      | Example
|-------|-------------------------------|-----------|---------------------
|uri*   | 指定接收的Page所在的uri       | String    | `auto`
|accept | 指定希望处理该信息的Page模块  | Array     | `['autoinfo']`
|args*  | 需要回传的参数                | Object    | `{"hello":"world."}`

```
    >love.req.infoback('attack', ['autoinfo'], {"Cookie":document.cookie});
    undefined
```
* 需要注意，infoback原则上是用来回传信息的，所以没有回调函数


love.load
---------
关于模块加载的封装，方法有
+ [script](#scriptfunction)，
+ [import](#importfunction)

### script:[function]
单独导入一个JavaScript文件

|Params | Description       | Type      | Example
|-------|-------------------|-----------|---------
|url*   | JS文件URL         | String    | `/hi.js`
|nrdm   | 不使用随机参数    | Bool      | `true`

|Callback Param | Type
|---------------|-------
|Null           | Null

```
    >love.load.script('/alert.js', function(){console.log(1)});
    undefined
    // alert 弹出
    1
```

### import:[function]
导入多个modules

|Params | Description               | Type      | Example
|-------|---------------------------|-----------|----------------------------------
|loads* | 模块名和模块参数的键值对  | Object    | `{"example":{"hello":"world."}}`

```
    >love.load.import({"cutimg":{"uri":"auto"}});
    undefined
    >love.load.import({"http://localhost/msf#msf":{"uri":"auto"}})
    undefined
```
* 按顺序导入模块
* 当指定导入的模块地址是URL时，需要将其名字放在锚点内，如例2
* 当键名不带"/"时，会自动补全成Hisoka的modules地址
* 同样，原则上仅用来导入模块，没有回调函数


love.dom
--------
关于DOM操作的封装，方法有
+ [inner](#innerfunction)，
+ [add](#addfunction)，
+ [create](#createfunction)，
+ [insert](#insertfunction)，
+ [kill](#killfunction)，
+ [attr](#attrfunction)

### inner:[function]
用innerHTML方法插入HTML代码。

|Params | Description           | Type      | Example
|-------|-----------------------|-----------|--------------------
|dom*   | 需要inner的HTML内容   | String    | `'<img src=#>'`
|hide   | 隐藏                  | Bool      | `true`
|e      | 父元素                | DOM       | `love.get.id('hi')`

|Callback Params | Type | Description
|----------------|------|-------------------
|dom             | DOM  | inner创建的DOM元素

|Return Description | Type
|-------------------|------
|inner创建的DOM元素 | DOM

```
    >love.dom.inner('<img src=# onerror=alert(1)>', true, love.get.body, function(){console.log(1)});
    <img src="#" onerror="alert(1)" style="display: none">
    1
    // 弹出 alert(1)
```
* 注意，inner一次只能插入一个元素，若要插入多个元素，还请用原生的innerHTML
* inner插入script tag是不起效的，还请用add

### add:[function]
使用DOM方法插入元素
是对love.dom.create和love.dom.insert的封装

|Params | Description   | Type      | Example
|-------|---------------|-----------|--------------------
|tag*   | 标签名        | String    | `'img'`
|attr   | 属性键值对    | Object    | `{"src":"#"}`
|parent | 父DOM         | DOM       | `love.get.id('hi')`

|Callback Param | Type  | Description
|---------------|-------|----------------
|e              | DOM   | 所创建的DOM元素
|parent         | DOM   | 父DOM

|Return Description | Type
|-------------------|------
|所创建的DOM元素    | DOM

```
    >love.dom.add('img', {"src":"/img.png"}, love.get.body, function(e, parent){console.log(parent)});
    <img src="/img.png">
    <body></body>
```

### create:[function]
创建元素

|Params | Description   | Type      | Example
|-------|---------------|-----------|--------------
|tag*   | 标签名        | String    | `'img'`
|attr   | 属性键值对    | Object    | `{"src":"#"}`

|Return Description | Type
|-------------------|------
|返回DOM元素        | DOM

```
    >love.dom.create('img', {"src":"/img.png"});
    <img src="/img.png">
```
* create只是创建了一个元素，并未插入DOM树

### insert:[function]
插入元素

|Params | Description   | Type  | Example
|-------|---------------|-------|--------------------------
|e*     | 待插入的元素  | DOM   | `love.dom.create('img')`
|parent | 父DOM         | DOM   | `love.get.body`

|Callback Param | Type  | Description
|---------------|-------|----------------
|e              | DOM   | 所插入的DOM元素
|parent         | DOM   | 父DOM

|Return Description | Type
|-------------------|------
|所插入的DOM元素    | DOM

```
    >love.dom.insert(love.dom.create('img', {"src":"/img.png"}), function(e, parent){console.log(parent)});
    <img src="/img.png">
    <body></body>
```
* insert的回调函数是在生成DOM之后执行，不是等待DOM加载完后执行

### kill:[function]
从DOM里删除元素

|Params | Description   | Type  | Example
|-------|---------------|-------|-------------------------
|e*     | 待删除的元素  | DOM   | `love.get.tag('img')[0]`

|Callback Param | Type
|---------------|------
|Null           | Null
```
    >love.dom.kill(love.get.tab('img')[0], function(){console.log(1)});
    undefined
    1
```
* 要删除的DOM元素必须要有父元素

### attr:[function]
获取或设置某元素的属性

|Params | Description               | Type      | Example
|-------|---------------------------|-----------|-------------------------
|e*     | 元素                      | DOM       | `love.get.tag('img')[0]`
|attr*  | 属性名                    | String    | `'src'`
|value  | 值，若未设置则返回属性值  | String    | `'#'`

|Return Description             | Type
|-------------------------------|--------
|若无value参数，将返回属性内容  | String
|若有value参数，将返回DOM元素   | DOM

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
方法和属性有
+ [isorigin](#isoriginfunction)，
+ [protocol](#protocolstr)，
+ [isdom](#isdomfunction)，
+ [id](#idnametagclassfunction)，
+ [name](#idnametagclassfunction)，
+ [tag](#idnametagclassfunction)，
+ [class](#idnametagclassfunction)，
+ [html](#htmlheadbodyfunction)，
+ [head](#htmlheadbodyfunction)，
+ [body](#htmlheadbodyfunction)，
+ [testorigin](#testoriginfunciton)

### isorigin:[function]
判断一个URL是否和当前域同源 or 判断两个URL是否同源

|Params | Description               | Type      | Example
|-------|---------------------------|-----------|-----------------------
|url*   | URL                       | String    | `'http://localhost/'`
|url2   | URL，若无则与当前域对白   | String    | `'http://localhost/'`

|Return Description             | Type
|-------------------------------|--------
|若同源则返回true，否则false    | Bool

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

|Params | Description   | Type  | Example
|-------|---------------|-------|---------
|e*     | 待判断的对象  | Null  | `'AAA'`

|Return Description     | Type
|-----------------------|------
|若是DOM元素则返回true  | Bool

```
    >love.get.isdom(love.get.id('hi'));
    true
```
* 别特地用`{'nodeType':true}`来捣乱

### testorigin:[function]
使用ajax测试某个URL和当前域是否同源

|Params | Description   | Type      | Example
|-------|---------------|-----------|-----------------------
|url*   | URL           | String    | `'http://localhost/'`

|Return Description     | Type
|-----------------------|------
|若测试同源则返回true   | Bool

```
    >love.get.testorigin('http://localhost/');
    true
```

### id,name,tag,class:[function]
对获取DOM元素的封装

|Params | Description           | Type      | Example
|-------|-----------------------|-----------|---------
|name*  | id, name, class, tag  | String    | `'id'`

|Return Description     | Type
|-----------------------|--------------
|DOM或是DOM组成的Array  | DOM or Array

```
    >love.get.id('hi');
    <div id="hi"></div>
    >love.get.tag('img')[0];
    <img src="/img.png" onerror="alert(1)" style="display: none">
```
* 需要注意，id方法返回的是单个DOM元素，而其他则是返回一个Array

### html,head,body:[function]
返回对应的DOM元素，

```
    >love.get.html() === love.get.tag('html')[0]
    true
```

love.op
-------
关于JavaScript的一些封装，
方法有
+ [bind](#bindfunction)，
+ [random](#randomfunction)，
+ [hook](#hookfunction)

### bind:[function]
关于绑定事件的封装

|Params | Description   | Type      | Example
|-------|---------------|-----------|-----------
|e*     | DOM元素       | DOM       | `love.dom.create('img')`
|name*  | 事件名        | String    | `'load'`
|foo*   | 事件函数      | Function  | `function(e){console.log(e)}`

|Return Description     | Type
|-----------------------|------
|被绑定事件的DOM元素    | DOM

```
    >love.op.bind(love.get.tag('img')[0], 'load', function(e){console.log(1)});
    <img src="#" onerror="alert(1)" style="display: none">
    >love.dom.attr(love.get.tag('img')[0], 'src', '/img.png');
    <img src="/img.png" onerror="alert(1)" style="display: none">
    1
```

### random:[function]
关于获取随机数的封装

|Params | Description       | Type  | Example
|-------|-------------------|-------|---------
|i      | 获取随机数的类型  | Bool  | `true`

|Return Description         | Type
|---------------------------|--------
|若无i，返回纯数字随机数    | Number
|若有i，返回字符串随机数    | String

```
    > love.op.random(false);
    85114.78146538138
    > love.op.random(true);
    "zb4kbg00tzm8ia4i"
```

### hook:[function]
关于函数钩子的实现

|Params | Description           | Type      | Example
|-------|-----------------------|-----------|-------------------------------------------------------------
|foo*   | 原函数，或是其他函数  | Function  | `alert`
|hook   | 钩子函数              | Function  | `function(foo_alert, str){console.log(str), foo_alert(str)}`

|Return Description             | Type
|-------------------------------|----------
|返回用作替代原函数的钩子函数   | Function

foo函数将会作为hook函数的第一个参数传入，而被hook的函数接收到的参数将会排在foo之后传入hook。
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
* 注意alert前面不要有声明局部变量的var


love.socket
-----------
关于WebSocket的封装，
方法有
+ [connet](#connetfunction)

### connet:[function]
连接到一个connet，将链接对象保存到`love.socket.conneted`

|Params | Description   | Type      | Example
|-------|---------------|-----------|---------
|name*  | WebSocks名    | String    | `'ws'`
|ws*    | WebSocks链接  | String    | `'ws://localhost/wstest'`

|Callback Param | Type      | Description
|---------------|-----------|-------------
|ws             | Object    | WebSocks对象

|Return Description | Type
|-------------------|--------
|WebSocks对象       | Object

```
    >love.socket.connet('ws', 'ws://localhost/wstest');
    WebSocketObject
    >love.socket.conneted
    Object {ws: WebSocketObject}
    >love.socket.conneted['ws://localhost/wstest'].send('Hello world.')
    undefined
```

love.run
--------
一些运行时的配置，
大概有
+ [jsonp](#jsonpobject)，
+ [args](#argsobject)，
+ [foo](#fooobject)

### jsonp:[object]
临时保存jsonp回调函数的地方。
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

### data:[object]
用来临时保存数据
```
    >var love.run.foo.example = {};
    undefined
```

----------------------------------------

# 大概写完了吧？以后有功能添加或更改再继续写
