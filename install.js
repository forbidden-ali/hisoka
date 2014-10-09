var mongoose = require('mongoose'),
    config = require('./config/config'),
    models = require('./config/models');

//  写的差不多的时候再重写整合一下吧
mongoose.connect(config.db);

function main(name, passwd, salt){
    var passwd = sql.hash(passwd+salt);
    var user = new models.User({
        name:name,
        passwd:passwd,
        salt:salt
    });
    user.save();
    return console.log('ok!');
};

if(process.argv.length < 3){
    console.log('Usage:');
    console.log('node config.js <name> <password> <salt>');
}else{
    main(process.argv[2], process.argv[3], process.argv[4]);
};
