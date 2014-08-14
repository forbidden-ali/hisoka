var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var _User = new Schema({
    name:String,
    passwd:String,
    salt:String
});

var _Victim = new Schema({
    url:String,
    id:String,
    who:String,
    payload:{},
    module:{},
    status:{},
    now:String
});

var _Page = new Schema({
    uri:String,
    type:String,
    module:{}
});

exports.User = mongoose.model('User', _User);
exports.Victim = mongoose.model('Victim', _Victim);
exports.Page = mongoose.model('Page', _Page);
exports.Db = 'mongodb://localhost/hisoka';
