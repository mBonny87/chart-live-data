const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const {DateTime} = require('luxon');
const io = new Server(server,{ cors: { origin: 'http://localhost:3000' } });

setInterval(() => {
  io.emit('temperature', {
    x: DateTime.utc().set({  milliseconds: 0 }).toISO({ suppressMilliseconds: true }),
    y: Math.floor(Math.random() * 40) + 1
  });
  io.emit('humidity', {
    x: DateTime.utc().set({  milliseconds: 0 }).toISO({ suppressMilliseconds: true }),
    y: Math.floor(Math.random() * 40) + 1
  });
  io.emit('precipitation', {
    x: DateTime.utc().set({  milliseconds: 0 }).toISO({ suppressMilliseconds: true }),
    y: Math.floor(Math.random() * 40) + 1
  });
}, 1000);

server.listen(3001, () => {
  console.log('listening on *:3001 😎😻');
});

