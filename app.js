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

const rooms = [{id: Math.floor(Math.random() * 8999 + 1000), users: 0}];

io.on('connection', async socket => {
    console.log(socket.id);

    if(!socket.room) {
        for(room of rooms) {
            if(room.users < 2) {
                socket.room = room;
                room.users++;
                socket.join(socket.room.id);
                break;
            }
        }

        if(!socket.room) {
            const room = {id: Math.floor(Math.random() * 8999 + 1000), users: 1};
            rooms.push(room);
            socket.room = room;
            socket.join(socket.room.id);
        }

        if(socket.room.users == 2)
            io.in(socket.room.id).emit('startGame');
    }

    socket.on('pose', pose => {
        socket.broadcast.emit('partnerPose', pose);
    });

    socket.on('disconnecting', () => {
        socket.room.users--;
    });

    console.log(rooms);
});

http.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
