
// add chat log
function addlog(data) {
  var date = new Date(data.time);
  console.log(date);
  $('#log').prepend($('<li/>').text(
    data.name + ' : ' + data.message
        + ' (' + date.getHours() + ':' + date.getMinutes()
        + ':' + date.getSeconds() + ')')
                   );
}

var socket = io.connect('http://localhost:3000/chat');

socket.on('chat.list', function(list) {
  for (var i = 0; i < list.length; i++) {
    addlog(list[i]);
  }
});
socket.on('chat.add', function(data) {
  addlog(data);
});

function send() {
  socket.emit('chat.add',{
    name:$('#name').val(),
    message:$('#message').val()
  });
  return false;
}