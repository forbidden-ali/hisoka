LoveJS Document
===============

`love.js`篇幅可能比较长，还是独立出来比较好
为了方便编写 Vmod，Hisoka封装了一个利用框架，称作`love.js`(伸缩自在的爱)。

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
[ajax](#ajaxfunction),
[json](#jsonfunction),
[post](#postfunction),
[infoback](#infobackfunction)

### ajax:[function]
封装了xhr操作

- @param - url, datas, headers, nsync, callback
- url*    - 目标的URL，需要是一个合法的URL字符串                eg: /index.html
- datas   - body内容，可以是字符串或是object字典                eg: {"hello":"world."}
- headers - 需要添加的请求头                                    eg: {"Client-IP":"127.0.0.1"}
- nsync   - 是否不使用同步xhr                                   eg: true
- callback - 如果最后一个参数是function，将会当作回调函数执行   eg: function(xhr){console.log(xhr.currentTarget.responseText)}

**love.req.ajax回调函数的参数是XMLHttpRequestProgressEvent，而非XMLHttpRequest，需要注意。**
**另一点需要注意的是，如果有headers，则默认不会带上Content-Type Headers**

### json:[function]
简化了json和jsonp的操作

- @param - url, callname, callback
- url*        - json或jsonp的地址，需要是一个URL字符串   eg: /hi.json
- callname    - 当指定了回调名时，执行jsonp操作，需要同时指定callback，且只能异步操作，没有返回 eg: callback
- callback    - 回调函数的参数即是json                   eg: function(json){console.log(json)}

### post:[function]
使用form实现的表单提交

- @param - url, datas, jump, callback
- url*    - action地址                                        eg: /post.php
- datas   - 一个object字典                                    eg: {"hello":"world."}
- jump    - 是否跳转，当不需要使用iframe实现不刷新时可以打开  eg: true
- callback - 回调函数

### infoback:[function]
将信息回传给Hisoka的封装

- @param - uri, accept, args
- uri*    - 指定接收的Page所在的URI.                          eg: auto
- accept* - 指定希望处理该信息的Page模块，需要是个Array       eg: ['autoinfo']
- args*   - 需要回传的参数们，是个object                      eg: {"hello":"world."}

**需要注意，infoback原则上是用来回传信息的，所以没有回调函数**


love.load
---------
关于模块加载的封装，子类有
[script](#scriptfunction),
[import](#importfunction)

### script:[function]
单独导入一个JavaScript文件

- @param - url, callback
- url*        - JavaScript file URL.  eg: /hi.js
- callback    - onload实现的回调函数  eg: function(){console.log('hi')}

### import:[function]
导入多个modules

- @param - loads
- loads*  - 是个object字典，键名为URL，键值为modules的参数，也是个object字典    eg: {"example":{"hello":"world."}}

**当键名不带"/"时，会自动补全成Hisoka的modules地址**
**同样，原则上仅用来导入模块，没有回调函数**


love.dom
--------
关于DOM操作的封装，子类有
[inner](#innerfunction),
[add](#addfunction),
[create](#createfunction),
[insert](#insertfunction),
[kill](#killfunction),
[attr](#attrfunction)

### inner:[function]
用innerHTML方法插入HTML代码。

- @param - dom, hide, e, callback
- dom*      - 需要inner的HTML内容                                   eg: '<img src=#>'
- hide      - 是否隐藏式，若启用，则inner的元素不会显示在页面上     eg: true
- e         - 父元素                                                eg: love.get.id('hi')
- callback  - 回调函数，参数为inner创建的元素

### add:[function]
使用DOM方法插入元素
是对love.dom.create和love.dom.insert的封装

- @param - tag, attr, parent, callback
- tag       - 标签名                                eg: 'img'
- attr      - 属性，需要是个object `{}`             eg: {"src":"#"}
- parent    - 父元素                                eg: love.get.id('hi')
- callback  - 回调函数，参数为创建的元素和父元素    eg: function(e, parent){console.log(e, parent)}

### create:[function]
创建元素

- @param - tag, attr
- tag   - 标签名    eg: 'img'
- attr  - 属性      eg: {"src":"#"}

### insert:[function]
插入元素

- @param - e, parent, callback
- e         - DOM元素   eg: love.dom.create('img')
- parent    - 父元素    eg: love.get.body
- callback  - 回调函数，参数为创建的元素和父元素

### kill:[function]
从DOM里删除元素

- @param - e, callback
- e         - 元素，必须在DOM中     eg: love.get.tag('a')[0]
- callback  - 回调函数，没有参数

### attr:[function]
获取或设置某元素的属性

- @param - e, attr, value
- e - 元素                                                          eg: love.get.tag('img')[0]
- attr - 属性名，如果未设置value，那么会返回该属性已设置的属性值    eg: 'src'
- value - 值                                                        eg: '#'


love.get
--------
上面也有用到一些`love.get`的内容，
是对获取信息的一些封装，
子类有
[isorigin](),
[protocol](),
[isdom](),
[id](),
[name](),
[tag](),
[class](),
[html](),
[head](),
[body](),
[testorigin]()

### isorigin:[function]
判断一个URL是否和当前域同源 or 判断两个URL是否同源

- @param - url, url2
- url/url2  - 字符串    eg: 'http://localhost/'

### protocol:[str]
当前建议使用的HTTP协议
若要ajax之类时，确定HTTP协议只需要

    love.get.protocol+'//localhost/'


### isdom:[function]
判断参数是否是DOM元素

- @param - e
- e - 任意          eg: 'AAAA'

### testorigin:[function]
使用ajax测试某个URL和当前域是否同源

- @param - url
- url - 字符串      eg: 'http://localhost/'

### id,name,tag,class:[function]
对获取DOM元素的封装

- @param - name
- name - id名之类的     eg: 'a'

**需要注意，id方法返回的是单个DOM元素，而其他则是返回一个Array**

### html,head,body:[DOM]
返回对应的DOM元素，

    love.get.html === love.get.tag('html')[0]


love.op
-------
# TODO
