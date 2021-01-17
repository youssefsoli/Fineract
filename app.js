const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const router = require('./routes/');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', router);

app.use(express.static(path.join(__dirname, 'client/build')));

let lastSocket = false;

io.on('connection', (socket) => {
    socket.on('connect', msg => {
        console.log('connected');
        if(lastSocket) {
            socket.partner = lastSocket;
            lastSocket.partner = socket;
            lastSocket = false;
            socket.emit('startGame');
        }
        else
            lastSocket = socket;
      socket.emit('waiting');
    });

    socket.on('pose', msg => {
        socket.partner.emit('partnerPose', msg.pose);
    })
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});