const express = require('express');
const cursosController = require('../controllers/cursos.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();
// RUTAS
api.post('/agregarCursos', md_autentificacion.Auth, cursosController.AgregarCursos);
api.get('/obtenerTodosLosCursos', md_autentificacion.Auth, cursosController.ObtenerTodosLosCursos);
api.get('/obtenerCursosProfesor', md_autentificacion.Auth, cursosController.ObtenerCursosProfesor);
api.put('/editarCurso/:idCurso', md_autentificacion.Auth, cursosController.EditarCursos);

module.exports = api;