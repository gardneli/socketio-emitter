/* Socket.io emitter */
var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res) {
  res.send('<h1>Hello Leland!</h1>');
});

http.listen(3001, function() {
  console.log('listening on *:3001');
});
