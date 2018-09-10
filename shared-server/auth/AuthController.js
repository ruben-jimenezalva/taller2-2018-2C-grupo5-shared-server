var express = require ('express'); 
var router = express.Router (); 
var bodyParser = require ('body-parser');

router.use (bodyParser.urlencoded ({extended: false})); 
router.use (bodyParser.json ()); 

//var User = require('../user/User');

var jwt = require ('jsonwebtoken'); 
var bcrypt = require (' bcryptjs '); 
var config = require ('../config');

router.post ('/token', function (req, res) {
    
    name = req.body.name || '';
    password = req.body.password || '';

    if (name == '' || password == ''){
      return res.json({code: 400, message: 'Incumplimiento de precondiciones (parámetros faltantes)'});
    }
/*
    var hashedPassword = bcrypt.hashSync (req.body.password, 8); 

    User.create ({
        username: req.body.name,
        password: hashedPassword 
    }, 
     function (err, user) {
      if (err) return res.json({code: 500, message: "Hubo un problema al registrar al usuario"});


    // creamos un usuario

      // crear un token 
      var token = jwt.sign ({id: user._id}, config.secret, {
        expiresIn: 86400 // caduca en 24 horas 
      });
      res.status (200) .send ({auth: true, token: token}); 
    }); 
    */
});