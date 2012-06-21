
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// socket.IO

var io = require('socket.io').listen(app);
var chats = [];
var sockets = {};

// broadcast function
function broadcast(method, message) {
  // 各socketに対して...
   for (var n in sockets) {
     // イベントを発火(=データの送信)
     sockets[n].emit(method, message);
   }
}

io.of('/chat').on('connection', function(socket) {
  sockets[socket.id] = socket;
  socket.emit('chat.list', chats);
  // 発言の追加を検知し，broadcastする
  socket.on('chat.add', function(data) {
    data.time = Date.now();
    chats.push(data);
    broadcast('chat.add', data);
  });
  // disconnectを検知したソケットは削除
  socket.on('disconnect', function() {
    delete sockets[socket.id];
  });
});

// Routes

app.get('/', routes.index);
app.get('/socket', function(req, res) {
  res.render('socketio', {title:'Socket.IO DEMO'});
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
