Hisoka Mod Document
===================

一个框架没有模块什么都干不了，大概。

Victim Mod.
-----------

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
为了方便编写 Vmod，Hisoka封装了一个利用框架，称作`love.js`(伸缩自在的爱)。

因为篇幅比较长，独立到[./LoveJS.md](https://github.com/quininer/hisoka/blob/master/doc/LoveJS.md)

### 一些约定
为了管理和编写Module，Hisoka定下了一些约定，
裸写JavaScript的话或许会觉得麻烦，但是不用担心，Hisoka都将其封装成了模块。

**一般的Vmod开发者，只需要看完[./LoveJS.md](https://github.com/quininer/hisoka/blob/master/doc/LoveJS.md)即可，无需关心约定的细节**

但是这里还是要说一下。

1. **信息回传给Hisoka，请用`[love.req.infoback](https://github.com/quininer/hisoka/blob/master/doc/LoveJS.md#infobackfunction)`**

    Hisoka本身不处理信息回传，而是交给`autoinfo`的服务端模块，
    `autoinfo`会处理`args`这个参数里的信息，并将其储存到数据库。

    **在约定中，args这个参数必须是JSON格式**

    而其他参数则另有他用。

2. **Vmod可以请求某些模块处理该信息!**

    `love.req.infoback`除去回传的信息，还有一个参数必填。
    `accept`要求是个Array，保存着请求处理该信息的服务端模块的名字。
    例如`love.req.infoback('page', ['autoinfo'], {"hello":"world."})`
    会请求`autoinfo`模块将`{"hello":"world."}`保存至数据库。

    **要注意，accept参数仅仅是个约定，不具备强制力**

    也就是说，其他未被请求的模块也可以处理该信息，但是
    **我建议，如非必要，请遵守这个约定**

3. **readme.json里的Name与Vmod以及函数名参数名和目录名务必一致**

    没什么好说的，方便寻址而已

4. **将Vmod函数放置在`love.run.foo.*`里**

    没什么好说的，方便再次调用。
    当然，如果是设置为只使用一次的Vmod，可以做成自执行的匿名函数

5. **Vmod的参数放置在`love.run.args.*里`**

    没什么好说的，只是找个地方放而已。

    **需要注意，因为考虑到可能需要调用多次的情况，`love.run.args.*`是个Array，依次保存着各个**

    执行Vmod时，只需要
    `love.run.foo.example(love.run.args.example.pop())`
    将最后一个参数弹出即可

6. **args里的参数名控制显示形式**

    例如
        `love.req.infoback('page', ['autoinfo'], {"html_hi":"<h1>HI</h1>"})`
    会将其放入iframe中显示
        `<iframe sandbox srcdoc="<h1>HI</h1>">`

    目前有一下几个显示约定
        `html_`: 需要是HTML源码
        `html_b64_`: 需要是被Base64编码的HTML源码
        `img_png_`: 需要是被Base64编码的PNG图片
        `img_jpg_`: 需要是被Base64编码的JPG图片

