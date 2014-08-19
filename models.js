var mongoose = require('mongoose');
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
    /*
    *   modules:{
    *       "auto_accept":{}
    *   }
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
    now:String
});
var _Page = new Schema({
    owner:String,
    name:String,
    uri:String,
    type:String,
    modules:{}
});

exports.User = mongoose.model('User', _User);
exports.Item = mongoose.model('Item', _Item);
exports.Victim = mongoose.model('Victim', _Victim);
exports.Page = mongoose.model('Page', _Page);
exports.Db = 'mongodb://'+
    process.env.OPENSHIFT_MONGODB_DB_USERNAME+':'+
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD+'@'+
    process.env.OPENSHIFT_MONGODB_DB_HOST+':'+
    process.env.OPENSHIFT_MONGODB_DB_PORT+'/hisoka';
