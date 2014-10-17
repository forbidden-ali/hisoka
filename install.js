var mongoose = require('mongoose'),
    fs = require('fs'),
    readline = require('readline'),
    models = require('./config/models');

var rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

function adduser(db, name, passwd, salt, callback){
    return callback();
    mongoose.connect(db);

    var passwd = models.hash(passwd+salt);
    var user = new models.User({
        name:name,
        passwd:passwd,
        salt:salt
    });
    user.save(function(err){
        if(err){
            console.error(err);
            console.error('Please check Mongodb URL is correct.');
            process.exit();
        }else{
            console.log('ok!');
        };
        callback();
    });
};

function createjson(config, callback){
    fs.writeFile(__dirname+'/config/config.json', JSON.stringify(config), callback);
};

function main(){
    var config = {},
        user = {};
    console.log('It will help you install Hisoka.');
    console.log('                                              quininer@live.com\n')

    console.log('First, the configuration database,','This should be a Mongodb URL.');
    console.log('*Including configuring the account password, and database name');
    rl.question('db[openshift]:', function(input){
        config.db = input||('mongodb://'+
        (process.env.OPENSHIFT_MONGODB_DB_USERNAME||'')+(process.env.OPENSHIFT_MONGODB_DB_PASSWORD?':':'')+
        (process.env.OPENSHIFT_MONGODB_DB_PASSWORD||'')+(process.env.OPENSHIFT_MONGODB_DB_USERNAME?'@':'')+
        (process.env.OPENSHIFT_MONGODB_DB_HOST||'localhost')+':'+
        (process.env.OPENSHIFT_MONGODB_DB_PORT||'27017')+'/hisoka');
        console.log('Here configuration Hisoka account.');
        rl.question('name:', function(input){
            user.name = input;
            rl.question('passwd:', function(input){
                user.passwd = input;
                console.log()
                console.log('Add user...');
                adduser(config.db, user.name, user.passwd, Math.random().toString(36).slice(2), function(){
                    console.log("Here's server configuration Hisoka.");
                    rl.question('ip[openshift]:', function(input){
                        config.ip = input||process.env.OPENSHIFT_NODEJS_IP;
                        rl.question('port[openshift]:', function(input){
                            config.port = input||process.env.OPENSHIFT_NODEJS_PORT||8080;
                            rl.question('ssl[null]:', function(input){
                                config.ssl = input||null;
                                rl.question("host['']:", function(input){
                                    config.host = input||'';
                                    createjson(config, function(err){
                                        if(err){
                                            console.error(err);
                                            console.error('Write to the configuration file fails.');
                                        }else{
                                            console.log('ok.');
                                        };
                                        process.exit();
                                    });
                                })
                            })
                        });
                    })
                });
            });
        });
    });
};

main();
