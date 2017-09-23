const path = require('path');
const http = require('http');

const express =  require('express');
const socketIO = require('socket.io');

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

    socket.emit('newMessage',{
        from: 'Admin',
        text: 'welcome to chat',
        createdAt: new Date().getTime
    });

    socket.broadcast.emit('newMessage',{
        from: 'Admin',
        text: 'new user joined',
        createdAt: new Date().getTime
    });

    socket.on('createMessage', (message)=>{
        console.log('message: ', message);
        io.emit('newMessage',{
            from: message.from,
            test: message.text,
            createdAt: new Date().getTime
        });
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