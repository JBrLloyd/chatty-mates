const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const constants = require('./utils/constants');
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.post('/room', () => {
  
})

io.on('connection', socket => {
  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit('message', formatMessage(constants.ADMIN_BOT, 'Welcome to the lobby!'));
    socket.broadcast.to(user.room).emit(
      'message',
      formatMessage(constants.ADMIN_BOT, `${user.username} has joined the room`)
    );

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  });
  
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  })

  socket.on('disconnect', () => {
    const user = userLeaves(socket.id);

    if(user) {
      io.to(user.room).emit(
        'message',
        formatMessage(constants.ADMIN_BOT, `${user.username} has left the room`)
      );

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
  })
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
