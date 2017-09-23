const path = require('path');
const http = require('http');

const express =  require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('new user connected');
    
    // socket.emit('newEmail',{
    //     from: 'abc@example.com',
    //     text: 'hello',
    //     createdAt: 123
    // });

    // socket.on('createEmail', (newEmail)=>{
    //     console.log('createEmail: ', newEmail);
    // })

    socket.emit('newMessage', generateMessage('Admin','welcome to chat'));

    socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined'));

    socket.on('createMessage', (message, callback)=>{
        console.log('message: ', message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('this is from server');
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     test: message.text,
        //     createdAt: new Date().getTime
        // });
    });

    socket.on('disconnect',()=>{
        console.log('user has disconnected');
    })
})



server.listen(port, ()=>{
    console.log(`started on port ${port}`);
});