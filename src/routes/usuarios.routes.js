const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();

//OBTENER TOKENS
api.post('/login', usuariosController.Login);

api.post('/registrarAlumno', usuariosController.RegistrarAlumno);

api.put('/editarUsuario/:idUsuario', md_autentificacion.Auth, usuariosController.EditarUsuarios);

api.delete('/eliminarUsuario/:idUsuario', md_autentificacion.Auth, usuariosController.EliminarUsuarios);
module.exports = api
