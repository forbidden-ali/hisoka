module.exports = {
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
