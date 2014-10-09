module.exports = {
    'ip':process.env.OPENSHIFT_NODEJS_IP,
    'port':process.env.OPENSHIFT_NODEJS_PORT||8080,
    'db':(
        'mongodb://'+
        process.env.OPENSHIFT_MONGODB_DB_USERNAME+':'+
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD+'@'+
        process.env.OPENSHIFT_MONGODB_DB_HOST+':'+
        process.env.OPENSHIFT_MONGODB_DB_PORT+'/hisoka'
    ),
    'ssl':null,
    'host':'',
};
