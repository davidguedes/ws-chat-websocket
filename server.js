const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require ('socket.io');
const PORT = 3000;

const allowedOrigins = ['https://chat-websocket-angular.vercel.app', 'http://localhost:4200'];

const app = express();
const server = http.createServer(app);

/*app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    })
);*/

const io = socketIo(server, {
    cors: { 
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin'],
        credentials: true,
    },
    transports: ['websocket'],
})

app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

// Quando um cliente se conecta
io.on('connection', (socket) => {

    io.emit('new_user', {id: socket.id});

    // Receber mensagem do cliente
    socket.on('message', (dataMessage) => {
        console.log('Mensagem recebida do cliente: ', dataMessage.user);

        // Broadcast da mensagem para todos os clientes conectados
        io.emit('message', {msg: dataMessage.message, user: dataMessage.user, user_id: dataMessage.user_id});
    });

    // Receber mensagem do cliente
    socket.on('new_user_name', (name) => {
        console.log('Novo cliente: ', name);

        // Broadcast do novo usuário para todos os clientes conectados
        io.emit('new_user_name', {user: name});
    });

    // Troca de mensagens para um cliente em especifico
    socket.on('private_message', (dataMessage) => {
        console.log('Mensagem recebida do cliente: ', dataMessage);

        // Broadcast da mensagem para todos os clientes conectados
        io.to(dataMessage.to).emit('message', {msg: dataMessage.privateMessage, user: dataMessage.user, user_id: dataMessage.user_id, private: true});
    });

    // Lidar com a desconexão do cliente
    socket.on('disconnect', (motivo) => {
        console.log(`Cliente desconectado! `, motivo);
    })
})

server.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});
