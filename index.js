/* Socket.io emitter */
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(3001, function() {
  console.log('listening on *:3001');
});
