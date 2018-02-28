const   express = require('express'),
        app = express(),
        config = require('./config/main'),
        cors = require('cors'),
        jwt = require('jsonwebtoken');

//app.get('/',(req, res)=>{
//    res.send('hola');
//});

//enables CORS request
var corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var routes = require('./app/routes');
app.use(cors(corsOptions));
//app.options('*',cors());
app.use(routes);

var http = require('http');
var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);

username = '';

io.use(function (socket, next) {
    console.log('new client');
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, config.secret, function (err, decoded) {
            if (err) {
                console.log('Connection refused ' + socket.handshake.query.token);
                return next(new Error('Authentication error'));
            }
            socket.decoded = decoded;
            username = decoded.username;
            console.log('User: ' + username);
            console.log('client authenticated');
            next();//the code will be on with the next events written below.
        });
    } else {
        return next(console.log('failed to authenticate a client'));//the code will stop here
    }
})
        .on('connection', function (socket) {
            
            console.log('socket opened; token: '+socket.handshake.query.token);
            socket.on('chat_msg', (msg) => {
                //console.log(msg);
                msg.username = username;
                console.log(msg);
                io.emit('chat_msg', msg);
            });
            
            
            
        });
        



httpServer.listen(config.port);
console.log('listening on *:' + config.port);

//var http = require('http');
//var httpServer = http.createServer(app);
//
//httpServer.listen(config.port, () => {
//    console.log('listening on *:' + config.port);
//});

        