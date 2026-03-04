// Inisialisasi socket
var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        // Kirim pesan ke server
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

// Terima pesan dari server
socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    document.getElementById('messages').appendChild(item);
    
    // Auto scroll ke bawah
    window.scrollTo(0, document.body.scrollHeight);
});