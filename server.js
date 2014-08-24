var express = require('express'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    evercookie = require('evercookie'),
    favicon = require('serve-favicon');
    mongoose = require('mongoose'),
    logger = require('morgan'),
    csrf = require('csurf'),
    ejs = require('ejs'),
    app = express(),
    server = require('http').createServer(app),
    ews = require('express-ws')(app, server),
    page = require('./routes/page'),
    home = require('./routes/home');

fs = require('fs'),
sql = require('./models');
mongoose.connect(sql.Db);

//   模板引擎
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

//   其它
app.use(logger());
app.use(cookieParser());
app.use(evercookie.backend());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret:'session'
}));
app.use('/home', csrf());
function err404(req, res, next){
    //  定义404页面
    return res.send(404, '( ・_・)');
};
app.use(favicon(__dirname+'/static/favicon.ico'));
app.use('/static', express.static(__dirname+'/static'));
app.use('/home', function(req, res, next){
    //  后台处理
    if(!req.session.user){return err404(req, res, next)};
    res.locals.token = req.csrfToken();
    res.header('X-Frame-Options', 'DENY');
    next();
});

app.all('/', page.xss);
app.all('/i/', page.load);
app.all('/h/:uri', page.http);
app.ws('/h/:uri', page.ws);
app.all('/home/page/:uri', page.http);
app.ws('/home/page/:uri', page.ws);

//   用户相关
app.route('/login')
    .get(home.login.get)
    .post(home.login.post);
app.post('/home/logout', home.login.logout);

// 用户页面
app.get('/home', home.home);

app.get('/home/item/:name', home.item.item);
app.post('/home/item/:name/edit', home.item.edit);

app.get('/home/victim/:name', home.victim.victim);
app.post('/home/victim:name/edit', home.victim.edit);

app.get('/home/page/:uri/editor', home.page.page);
app.post('/home/page/:uri/edit', home.page.edit);

app.all('/home/modules', home.modules);

app.use('*', err404);
app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
    process.env.OPENSHIFT_NODEJS_IP);
