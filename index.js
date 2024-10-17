const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const server = http.createServer(app);
app.use(express.static("./public"));

const io = new Server(server);
let users = {};
io.on('connection',(socket)=>{

    //assign default nickname
    socket.nickname = `User${Math.floor(Math.random()*1000)}`;
    users[socket.id] = socket.nickname;

    //emit to all other users that someone has joined
    io.emit('user joined',{user: socket.nickname, users: Object.values(users)});

    socket.on('set nickname',(nickname)=>{
        users[socket.id] = nickname;
        socket.nickname = nickname;
        io.emit('nickname changed',{id: socket.id, nickname});
    })

    socket.on('chat message',(msg)=>{
        io.emit('chat message',msg);
    })

    //detect when a user is disconnected
    socket.on('disconnect',()=> {
        console.log(`User ${socket.id} disconnected`);
        delete users[socket.id];
        io.emit('user left',{user: socket.nickname, users: Object.values(users)});
    })

    //Functionality : Status of if a person is typing or not
    socket.on('typing',()=> {
        socket.broadcast.emit('typing',{user: socket.nickname});
    })

    //stop typing notification
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', { user: socket.nickname });
    });

})


app.get("/", (req, res) => {
    res.sendFile("./public/index.html");
})

server.listen(9000,()=>{
    console.log("Server is running on port 9000")
})