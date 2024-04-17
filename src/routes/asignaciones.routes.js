// 
const express = require('express');
const asignacionesController = require('../controllers/asignaciones.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();

// RUTAS
api.post('/agregarAsignacionAlumno', md_autentificacion.Auth, asignacionesController.AgregarAsignacion);

// OBTENER TODAS ASIGNACIONES ALUMNO
api.get('/obtenerAsignacionesAlumno', md_autentificacion.Auth, asignacionesController.ObtenerAsignacionesAlumno)

// OBTENER ASIGNACIONSE MAESTRO
api.get('/obtenerAsignacionesMaestro', md_autentificacion.Auth, asignacionesController.ObtenerAsignacionesMaestro)

// OBTENER LAS ASIGNACION DE X ALUMNO
api.get('/asignacionesAlumnoPorId/:idAlumno?', md_autentificacion.Auth, asignacionesController.AsignacionesAlumnoPorId)

module.exports = api;