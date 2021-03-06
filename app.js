
/**
 * Module dependencies.
 */

var express      = require('express');
var routes       = require('./routes');
var http         = require('http');
var path         = require('path');
var socketio     = require('socket.io');

var userMgr      = require('./routes/userMgr');
var index        = require('./routes/index');
var estimation   = require('./routes/estimation');
var view         = require('./routes/view');
var cheat        = require('./routes/cheat');

var app          = express();

// all environments
app.set('port', process.env.PORT || require('./routes/modules/common').get().port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.bodyParser());

app.use(express.cookieParser()) // required before session.
app.use(express.session({
    secret: '핫핫',
}));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.post('/login', userMgr.login);
app.post('/mail', userMgr.mail);

app.get('/', routes.index);
app.get('/get', index.get);
app.get('/data', index.data);
app.get('/passwordGet', index.passwordGet);

app.get('/estimation', userMgr.loginCheck, estimation.index);
app.get('/view', userMgr.loginCheck, view.index);
app.get('/cheat', userMgr.loginCheck, cheat.index);
app.get('/cheat/get', cheat.get);
app.get('/cheat/download', cheat.download);
app.get('/join', userMgr.join);
app.get('/user', function(req, res){
    res.render("join.html");
});

app.post('/view', view.input);
app.post('/cheat/upload', cheat.upload);

// Exception Mail Send
process.on('uncaughtException', function(error){
    console.log("Error : " + error);
    require("./routes/modules/mail").send({
        to: "hyurecord@gmail.com",
        subject: "한학기 에러",
        html: "<p>" + error + "</p>"
    });
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

server.listen(require('./routes/modules/common').port);
var io = socketio.listen(server);
io.set('log level', 2);
io.sockets.on('connection', function(socket){
    socket.on('join', function(data){
        socket.join('hangang');
    });

    socket.on('input', function(data){
        io.sockets.in('hangang').emit('input', data);
    });
});