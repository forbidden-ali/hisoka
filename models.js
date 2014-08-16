var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var _User = new Schema({
    email:String,
    name:String,
    passwd:String,
    salt:String
});

var _Victim = new Schema({
    name:String,
    victim:String,
    id:String,
    who:{},
    payload:{},
    module:{},
    status:{},
    now:String
});

var _Page = new Schema({
    name:String,
    uri:String,
    type:String,
    module:{}
});

exports.User = mongoose.model('User', _User);
exports.Victim = mongoose.model('Victim', _Victim);
exports.Page = mongoose.model('Page', _Page);
exports.Db = 'mongodb://'+
    process.env.OPENSHIFT_MONGODB_DB_USERNAME+':'+
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD+'@'+
    process.env.OPENSHIFT_MONGODB_DB_HOST+':'+
    process.env.OPENSHIFT_MONGODB_DB_PORT+'/hisoka';
