var socket = io();
var username = "";

function joinChat() {
    username = document.getElementById('usernameInput').value;

    if (username.trim() !== "") {
        socket.emit('join', username);
        document.getElementById('login').style.display = "none";
        // Ubah ke flex agar layout responsif CSS tidak hancur
        document.getElementById('chat').style.display = "flex"; 
    }
}

var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages');
var usersList = document.getElementById('users');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function(data) {
    var item = document.createElement('li');

    if (data.user === username) {
        item.classList.add("me");
    }

    item.innerHTML = `<strong>[${data.time}] ${data.user}:</strong> ${data.text}`;
    messages.appendChild(item);

    // Perbaikan auto-scroll khusus untuk area pesan
    messages.scrollTop = messages.scrollHeight;
});

socket.on('chat history', function(history) {
    history.forEach(data => {
        var item = document.createElement('li');
        item.innerHTML = `<strong>[${data.time}] ${data.user}:</strong> ${data.text}`;
        messages.appendChild(item);
    });
    messages.scrollTop = messages.scrollHeight;
});

socket.on('user list', function(users) {
    usersList.innerHTML = "";
    users.forEach(user => {
        var li = document.createElement('li');
        li.textContent = user;
        usersList.appendChild(li);
    });
});

// [FITUR BARU] Fungsi Hapus Chat
function clearChat() {
    if (confirm("Apakah Anda yakin ingin menghapus chat untuk SEMUA ORANG?")) {
        socket.emit('clear chat');
    }
}

// [FITUR BARU] Menerima perintah hapus dari server
socket.on('chat cleared', function() {
    messages.innerHTML = '';
});