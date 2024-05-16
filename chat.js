var express = require('express');
var router = express.Router();
const axios = require('axios');

// Chat messages
let chatMessages = [];

// Notification messages
let notifications = [];

// Chat Routes
router.get('/chat', (req, res) => {
    console.log('Accessed chat page');
    res.render('chat', { title: 'Chat', messages: chatMessages });
});

router.post('/chat/send-chat', (req, res) => {
    const message = req.body.message;
    console.log('Received chat message:', message);
    chatMessages.push(message);
    notifications.push(`New chat message: ${message}`); // Add this line to push to notifications

    res.json({ success: true });
});

router.get('/chat/receive-chat', (req, res) => {
    console.log('Sent chat messages');
    res.json({ messages: chatMessages });
    chatMessages = []; // Clear messages after sending
});

// Notification Routes
router.get('/notifications', (req, res) => {
    console.log('Accessed notifications page');
    res.render('notification_center', { title: 'Notifications', notifications });
});

router.post('/notifications/send-notifications', (req, res) => {
    const message = req.body.message;
    console.log('Received notification message:', message);
    notifications.push(message);

    // Send notification to chat server
    axios.post('http://localhost:3000/chat/send-chat', { message })
        .then(response => {
            res.json({ success: true });
        })
        .catch(error => {
            console.error('Error sending notification to chat:', error.message);
            res.json({ success: false, error: error.message });
        });
});

router.get('/notifications/receive-notifications', (req, res) => {
    console.log('Sent notifications');
    res.json({ messages: notifications });
    notifications = []; // Clear notifications after sending
});

module.exports = router;
