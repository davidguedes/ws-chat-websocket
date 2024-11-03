const express = require('express');
const cors = require('cors');
const http = require('http');
const PORT = 3000;

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

server.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});