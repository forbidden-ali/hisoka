var mongoose = require('mongoose'),
    crypto = require('crypto'),
    models = require('./models');

mongoose.connect(models.Db);

function main(name, passwd, salt){
    var passwd = crypto.createHash('md5').update(
        passwd + salt
    ).digest('hex');
    var user = new models.User({
        name:name,
        passwd:passwd,
        salt:salt
    });
    user.save();
};

if(process.argv.length < 3){
    console.log('Usage:');
    console.log('node config.js <name> <password> <salt>');
}else{
    main(process.argv[2], process.argv[3], process.argv[4]);
};
