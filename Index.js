const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = {};
let messages = [];

function getTime() {
    const now = new Date();
    return now.toLocaleTimeString();
}

io.on('connection', (socket) => {

    socket.on('join', (username) => {
        users[socket.id] = username;

        socket.emit('chat history', messages);

        io.emit('user list', Object.values(users));

        io.emit('chat message', {
            user: "SYSTEM",
            text: `${username} bergabung`,
            time: getTime()
        });
    });

    socket.on('chat message', (msg) => {
        const messageData = {
            user: users[socket.id],
            text: msg,
            time: getTime()
        };

        messages.push(messageData);
        io.emit('chat message', messageData);
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];

        io.emit('user list', Object.values(users));

        io.emit('chat message', {
            user: "SYSTEM",
            text: `${username} keluar`,
            time: getTime()
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});