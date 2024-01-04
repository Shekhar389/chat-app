const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

//creating server instance
const server = http.createServer(app);

app.use(cors());

//creating socket using server instance
const io = new Server(server ,{
    cors: {
        origin : '*',
        methods : ['GET','POST']
    }
})
// whenever a user connects on port 3000 via a websocket, log that a user has connected
let users = [];

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('message', (data) => {
    console.log(data);
    io.emit('messageResponse', data);
  });

  //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    io.emit('newUserResponse', users);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    io.emit('newUserResponse', users);
    socket.disconnect();
  });
});


// start our server listening on port 3000
server.listen(3000, () => {
    console.log('listening on *:3000');
});