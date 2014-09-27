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

####

**TODO**
