var mongoose = require('mongoose'),
    fs = require('fs');
    models = require('./config/models');

function read(){
    process.stdout.write(prompt+':');
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', function(chunk){
        process.stdin.pause();
        callback(chunk);
    });
};

function createdb(db, name, passwd, salt, callback){
    mongoose.connect(config.db);

    var passwd = sql.hash(passwd+salt);
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
    fs.writeFile(__dirname+'config/config.json', JSON.stringify(config), callback);
};

function main(){
    var config = {},
        user = {};
    console.log('It will help you install Hisoka.');
    console.log('               quininer@live.com\n')

    console.log('First, the configuration database,','This should be a Mongodb URL.');
    console.log('*Including configuring the account password, and database name');
    read('db[openshift]', function(input){
        config.db = input||'mongodb://'+
        process.env.OPENSHIFT_MONGODB_DB_USERNAME+':'+
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD+'@'+
        process.env.OPENSHIFT_MONGODB_DB_HOST+':'+
        process.env.OPENSHIFT_MONGODB_DB_PORT+'/hisoka';
        console.log('Here configuration Hisoka account.');
        read('name', function(input){
            user.name = input;
            read('passwd', function(input){
                user.passwd = input;
                console.log('Creating a db...')
                createdb(config.db, user.name, user.passwd, Math.random().toString(36).slice(2), function(){
                    console.log("Here's server configuration Hisoka.");
                    read('ip[openshift]', function(input){
                        config.ip = input||process.env.OPENSHIFT_NODEJS_IP;
                        read('port[openshift]', function(input){
                            config.ip = input||process.env.OPENSHIFT_NODEJS_PORT||8080;
                            read('ssl[null]', function(input){
                                config.ssl = input||null;
                                read("host['']", function(input){
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
