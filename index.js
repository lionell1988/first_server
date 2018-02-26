const   express = require('express'),
        app = express(),
        config = require('./config/main');
jwt = require('jsonwebtoken');

//app.get('/',(req, res)=>{
//    res.send('hola');
//});

var routes = require('./app/routes');

app.use(routes);

var http = require('http');
var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);

io.use(function (socket, next) {
    console.log('new client');
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, config.secret, function (err, decoded) {
            if (err)
                return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();//the code will be on with the next events written below.
        });
    }
    next(
            console.log('failed to authenticate a client'));//the code will stop here
})
        .on('connection', function (socket) {
            socket.on('message', function (message) {
                io.emit('message', message);
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

        