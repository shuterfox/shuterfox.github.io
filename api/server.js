const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
    cors: { origin: "*" } // Autorise toutes les sources pour le prototype
});

const rooms = {};

io.on('connection', (socket) => {
    // 1. La TV crée une salle
    socket.on('CREATE_ROOM', () => {
        const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
        socket.join(roomId);
        rooms[roomId] = { host: socket.id, players: [] };
        socket.emit('ROOM_CREATED', roomId);
        console.log(`Salle créée : ${roomId}`);
    });

    // 2. Un joueur rejoint une salle
    socket.on('JOIN_ROOM', ({ roomId, playerName }) => {
        if (rooms[roomId]) {
            socket.join(roomId);
            rooms[roomId].players.push({ id: socket.id, name: playerName });
            // On prévient la TV qu'un joueur est arrivé
            io.to(roomId).emit('PLAYER_JOINED', playerName);
            socket.emit('JOIN_SUCCESS');
        } else {
            socket.emit('ERROR', 'Salle introuvable');
        }
    });

    // 3. Relais des réponses (Joueur -> TV)
    socket.on('SEND_ANSWER', ({ roomId, text }) => {
        // On envoie la réponse uniquement à la TV (le host)
        io.to(roomId).emit('NEW_ANSWER', { player: socket.id, text: text });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur de jeu sur le port ${PORT}`));