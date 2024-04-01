const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();

//OBTENER TOKENS
api.post('/login', usuariosController.Login);

// registrar usuarios
api.post('/registrarUsuarios', usuariosController.registrarUsuarios);



module.exports = api
