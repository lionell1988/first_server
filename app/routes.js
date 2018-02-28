const   passport = require('passport'),
        express = require('express'),
        config = require('../config/main'),
        jwt = require('jsonwebtoken'),
        bodyParser = require('body-parser'),
        urlencodedParser = bodyParser.urlencoded({extended: false});


var router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    res.send('Home');
});

router.get('/route1', (req, res) => {
    res.send('Route1');
});

//LOGIN
router.post('/login', urlencodedParser, (req, res) => {
    console.log('login required');
    if (!req.body)
        return res.sendStatus(400);
    else {
        if (req.body.name !== null && req.body.password !== null) {
            u = new Object();
            // console.log(req.body.username);
            u.username = req.body.username;
            u.password = req.body.password;

            authenticate(u).then((auth) => {
                console.log(auth);
                if (auth) {
                    const token = createToken(u);
                    res.json({'msg':{'txt': 'welcome', 'code': 200},'token':token});
                } else {
                    //res.sendStatus(403);
                    res.json({'msg':{'txt': 'Failed', code: 403}});
                }
            }).catch((error) => {
                console.log(error);
                res.sendStatus(403);
            });
        } else {
            console.log('error');
            res.sendStatus(400);

        }

    }
});

function createToken(u) {
    var token = jwt.sign(u, config.secret, {
        expiresIn: 1440
    });
    return token;
}



function authenticate(u) {
    return new Promise((resolve, reject) => {
        let mysql = require('mysql');
        console.log('logging ' + u.name + ' ' + u.pwd);
        var auth = false;
        var name = u.username;
        var pwd = u.password;
        var query = 'SELECT * FROM users WHERE name ="' + name + '" AND pwd = "' + pwd + '"';
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "chat_db"
        });
        con.connect((err) => {
            console.log('connection to db');
            if (err)
                return reject(err);
            con.query(query, function (err, result) {
                if (err)
                    return reject(err);
                if (result.length > 0)
                    auth = true;
                resolve(auth);
                // console.log(result[0].name);
            });

        });

    });
}

module.exports = router;