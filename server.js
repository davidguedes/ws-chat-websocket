const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
})

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

// Quando um cliente se conecta
io.on('connection', (socket) => {

    io.emmit('new_user', {id: socket.id});

    // Receber mensagem do cliente
    socket.on('message', (dataMessage) => {
        console.log('Mensagem recebida do cliente: ', dataMessage.user);

        // Broadcast da mensagem para todos os clientes conectados
        io.emmit('message', {msg: dataMessage.message, user: dataMessage.user, user_id: dataMessage.user_id});
    });

    // Lidar com a desconexão do cliente
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado!`);
    })
})

server.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});