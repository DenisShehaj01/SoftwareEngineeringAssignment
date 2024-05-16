const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main chat interface
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve the notifications interface
app.get('/notifications', (req, res) => {
    res.render('notifications');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new message', (data) => {
        io.emit('broadcast message', data);  // Broadcasting to all clients
    });

    socket.on('new notification message', (data) => {
        io.emit('broadcast message', data);  // Also broadcasting these back to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
