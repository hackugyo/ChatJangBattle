
// add chat log
function addlog(data) {
  var date = new Date(data.time);
  var text_first = data.name + ' : ' + data.message;
  var text_middle = ' (' + data.points + ' points get!) ';
  var text_last = ' (' + date.getHours() + ':' + date.getMinutes()
      + ':' + date.getSeconds() + ')';
  var text;
  if (data.points > 0) {
    text = text_first + text_middle + text_last;
  } else {
    text = text_first + text_last;
  }
  console.log(date);
  $('#log').prepend($('<li/>').text(text));
}

var socket = io.connect('http://localhost:3000/chat');

// 一覧表示要請を検知し，ログを表示する
socket.on('chat.list', function(list) {
  for (var i = 0; i < list.length; i++) {
    addlog(list[i]);
  }
});

// 発言追加要請を検知し，追加する
socket.on('chat.add', function(data) {
  addlog(data);
});

function send_p() {
  socket.emit('chat.add',{
    name:$('#name').val(),
    message:'ぱー'
  });
  return false;
}
function send_c() {
  socket.emit('chat.add',{
    name:$('#name').val(),
    message:'ちょき'
  });
  return false;
}

function send_g() {
  socket.emit('chat.add',{
    name:$('#name').val(),
    message:'ぐー'
  });
  return false;
}

function send() {
  socket.emit('chat.add',{
    name:$('#name').val(),
    message:$('#message').val(),
  });
  return false;
}