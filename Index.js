const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Memberitahu express untuk mengambil file statis (html/css) dari folder 'public'
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Ada user konek nih!');
    
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Kirim pesan ke semua orang
    });
});


const PORT = process.env.PORT || 3000; // Menggunakan port dari server atau default 3000
server.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});