/* Socket.io emitter */
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const testJson = {'message': 'hello'};

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  let i = 1;
  function transmitLoop() {
    setTimeout(function () {
      console.log('Transmitting message: ', testJson);
      io.emit('message', testJson);
      i++;
      if (i < 10) {
        transmitLoop();
      }
    }, 2000);
  }
  transmitLoop();

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(3001, function() {
  console.log('listening on *:3001');
});
