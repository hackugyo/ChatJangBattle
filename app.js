
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

var default_message = 'default_message';

io.of('/chat').on('connection', function(socket) {
  sockets[socket.id] = socket;
  console.log("new player: " + String(socket.id));
  // 最初の発言を設定
  socket.last_message = '未入力';
  
  // 参加を検知し，参加者のみに過去ログ表示を発火する
  socket.emit('chat.list', chats);
  
  // 発言の追加を検知し，broadcastする（全員に発火）
  socket.on('chat.add', function(data) {
    // JSはブロックスコープを持たないので，
    // 変数定義は関数の先頭で行う
    var points;
    var socket_id = socket.id;

    // 発言データを生成
    data.time = Date.now();
    points = count_wins(data.message, socket_id, sockets);
    data.points = points;
    // 発言結果を格納
    socket.last_message = data.message;
    socket.current_points = socket.current_points || 0;
    socket.current_points += points;
    
    chats.push(data);
    broadcast('chat.add', data);
    if (socket.current_points >= 20) {
      socket.current_points = 0;
      broadcast('chat.add', {
        time:Date.now(),
        name:'__system__',
        message:data.name + ' win!! reset ' + data.name + ' \'s points.',
        points:0
      });
    }      
  });
  
  // disconnectを検知したソケットは削除
  socket.on('disconnect', function() {
    delete sockets[socket.id];
  });
});

// 勝敗決定
function count_wins(message, socket_id) {
  var points = 0;
  var players = 0;
  for (var n in sockets) {
    var enemy = sockets[n];
    enemy.is_ready = is_ready;
    players = players + 1;
    if (enemy.is_ready(socket_id)) {
      // FakeIt, じゃんけん勝敗を判定する必要がある
      if (win(message, enemy.last_message)) {

        points += 1;
      }
    }
  }
    return points;
}

function is_ready(socket_id) {
  // まだ入力していないか，自分自身であるかの場合には無視．
  if (this.last_message !== default_message && this.id !== socket_id) {
    return true;
  } else {
    return false;
  }
}

function win(message, enemy_message) {
  if (message === 'ぱー' && enemy_message === 'ぐー') {
    return true;
  } else if (message === 'ぐー' && enemy_message === 'ちょき') {
    return true;
  } else if (message === 'ちょき' && enemy_message === 'ぱー') {
    return true;
  } else {
    return false;
  }
}

// Routes

app.get('/', routes.index);
app.get('/socket', function(req, res) {
  res.render('socketio', {title:'Socket.IO DEMO'});
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
