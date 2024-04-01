const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

// Obtener por el id del usuario
api.get("/obtenerUsuarioId/:idUsuario", md_autenticacion.Auth, usuarioController.obtenerUsuarioId);



// Logearse
api.post("/login", usuarioController.login);

// Registrar usuarios
api.post("/registrarUsuarios", usuarioController.usuariosRegistrar);

// Buscar las habitaciones
api.post("/buscarHabitacionesHotel", md_autenticacion.Auth, usuarioController.buscarHabitacionesHotel);

// Buscar eventos
api.post("/buscarEventosHotel", md_autenticacion.Auth, usuarioController.buscarEventosHotel);

// Reservacion
api.post("/reservar/:habitacionID", md_autenticacion.Auth, usuarioController.reservacion);


module.exports = api;
