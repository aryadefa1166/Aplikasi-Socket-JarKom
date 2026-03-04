var socket = io();
var username = "";

function joinChat() {
    username = document.getElementById('usernameInput').value;

    if (username.trim() !== "") {
        socket.emit('join', username);
        document.getElementById('login').style.display = "none";
        document.getElementById('chat').style.display = "block";
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

    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('chat history', function(history) {
    history.forEach(data => {
        var item = document.createElement('li');
        item.innerHTML = `<strong>[${data.time}] ${data.user}:</strong> ${data.text}`;
        messages.appendChild(item);
    });
});

socket.on('user list', function(users) {
    usersList.innerHTML = "";
    users.forEach(user => {
        var li = document.createElement('li');
        li.textContent = user;
        usersList.appendChild(li);
    });
});