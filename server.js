const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize the profanity filter
const Filter = require('bad-words'); 
const filter = new Filter(); 

// Optional: specific words you want to whitelist or blacklist
filter.addWords('kill'); 
filter.removeWords('hell');

// Security middleware
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const PORT = process.env.PORT || 3000;
const MAX_MESSAGES_PER_CIRCLE = 50;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Add a catch-all route to serve index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// In-memory data store for circles
const circles = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('newUser', (data) => {
        const { nickname: rawNickname, flair: rawFlair, clientToken, circle: circleId } = data;

        // Sanitize inputs (XSS)
        // CHANGE 1: 'let' instead of 'const' so we can modify them
        let nickname = xss(rawNickname).slice(0, 30);
        let flair = xss(rawFlair).slice(0, 50); 

        if (!nickname) {
            socket.emit('nicknameError', { message: 'Nickname cannot be empty.' });
            return;
        }

        // --- PROFANITY CHECK 1: NICKNAMES ---
        if (filter.isProfane(nickname)) {
            nickname = filter.clean(nickname);
        }

        // --- PROFANITY CHECK 2: FLAIR (NEW) ---
        // We check if flair exists first to avoid errors on empty strings
        if (flair && filter.isProfane(flair)) {
            flair = filter.clean(flair);
        }
        // ---------------------------------------
        
        // Ensure circle exists
        if (!circles[circleId]) {
            circles[circleId] = {
                users: new Map(),
                messages: {
                    byId: new Map(),
                    order: [],
                }
            };
        }
        const circle = circles[circleId];

        // Nickname uniqueness check
        const existingUser = Array.from(circle.users.values()).find(u => u.nickname === nickname);
        if (existingUser && existingUser.clientToken !== clientToken) {
            socket.emit('nicknameError', { message: `Nickname "${nickname}" is already in use. Please choose another.` });
            return;
        }

        // Join the socket room
        socket.join(circleId);
        // Store circle on the socket for easy access on disconnect
        socket.circleId = circleId;

        // Store user data
        const user = { nickname, flair, clientToken, id: socket.id, avatar: '👤' };
        circle.users.set(socket.id, user);

        console.log(`${nickname} (${socket.id}) joined circle: ${circleId}`);

        // Send message history to the new user
        socket.emit('messageHistory', Array.from(circle.messages.byId.values()));

        // Broadcast system message to the circle
        io.to(circleId).emit('systemMessage', { text: `${nickname} has joined the circle.`, type: 'join' });
        
        // Send the updated user list to everyone in the circle
        io.to(circleId).emit('userList', Array.from(circle.users.values()));
    });

    socket.on('chatMessage', (messageData) => {
        const circleId = socket.circleId;
        const circle = circles[circleId];
        const user = circle ? circle.users.get(socket.id) : null;

        if (user && circle) {
            let repliedToMessage = null;
            if (messageData.replyTo) {
                repliedToMessage = circle.messages.byId.get(messageData.replyTo);
            }

            // Sanitize and validate message text
            const sanitizedText = xss(messageData.text).slice(0, 500);

            if (!sanitizedText) {
                return; // Ignore empty messages
            }

            // --- PROFANITY CHECK 3: CHAT MESSAGES ---
            const cleanText = filter.clean(sanitizedText);
            // ----------------------------------------

            const fullMessage = {
                id: Date.now() + '-' + Math.random(),
                username: user.nickname,
                flair: user.flair,
                avatar: user.avatar,
                text: cleanText, 
                style: messageData.style, 
                timestamp: new Date(),
                replyTo: repliedToMessage ? {
                    username: repliedToMessage.username,
                    text: repliedToMessage.text 
                } : null
            };
            
            // Add to message history and cap it
            circle.messages.byId.set(fullMessage.id, fullMessage);
            circle.messages.order.push(fullMessage.id);
            if (circle.messages.order.length > MAX_MESSAGES_PER_CIRCLE) {
                const oldestMessageId = circle.messages.order.shift();
                circle.messages.byId.delete(oldestMessageId);
            }

            // Broadcast the message to the circle
            io.to(circleId).emit('message', fullMessage);
        }
    });

    socket.on('disconnect', () => {
        const circleId = socket.circleId;
        const circle = circles[circleId];

        if (circle) {
            const user = circle.users.get(socket.id);
            if (user) {
                console.log(`${user.nickname} has left circle: ${circleId}`);
                
                // Remove user from the circle
                circle.users.delete(socket.id);

                // If the circle is empty, delete it to save memory
                if (circle.users.size === 0) {
                    delete circles[circleId];
                    console.log(`Circle ${circleId} is empty and has been removed.`);
                } else {
                    // Broadcast that the user has left and the new user list
                    io.to(circleId).emit('systemMessage', { text: `${user.nickname} has left the circle.`, type: 'leave' });
                    io.to(circleId).emit('userList', Array.from(circle.users.values()));
                }
            }
        }
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
