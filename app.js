
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
  console.log("new player: " + String(socket.id));
  // 最初の発言を設定
  socket.last_message = 'ぐー';
  
  // 参加を検知し，参加者のみに過去ログ表示を発火する
  socket.emit('chat.list', chats);
  
  // 発言の追加を検知し，broadcastする（全員に発火）
  socket.on('chat.add', function(data) {
    // JSはブロックスコープを持たないので，
    // 変数定義は関数の先頭で行う
    var point;
    var socket_id = socket.id;

    // 発言データを生成
    data.time = Date.now();
    point = check_winner(data.message, socket_id, sockets);
    data.point = String(point) + ' points get!'

    // 発言データを格納
    socket.last_message = data.message;
    
    chats.push(data);
    broadcast('chat.add', data);
  });
  
  // disconnectを検知したソケットは削除
  socket.on('disconnect', function() {
    delete sockets[socket.id];
  });
});

// 勝敗決定
function check_winner(message, socket_id) {
  var point = 0;
  var players = 0;
  for (var n in sockets) {
    var enemy = sockets[n];
    players = players + 1;
    console.log("player no. " + String(players));
    console.log("socket n id = " + String(enemy.id));
    if (enemy.id !== socket_id) {
      // FakeIt, じゃんけん勝敗を判定する必要がある
      console.log("socket  id = " + String(socket_id));
      if (enemy.last_message === message) {
        console.log("socket n last_message = " + enemy.last_message);
        point = point + 1;
      }
    }
  }
  return point;
}

// Routes

app.get('/', routes.index);
app.get('/socket', function(req, res) {
  res.render('socketio', {title:'Socket.IO DEMO'});
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
