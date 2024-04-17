// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();


// RUTAS
const UsuariosRutas = require('./src/routes/usuarios.routes');
const CursosRutas = require('./src/routes/cursos.routes');
const AsignacionesRutas = require('./src/routes/asignaciones.routes')

// MIDDLEWARE INTERMEDIARIO
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERA
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuariosRutas, CursosRutas, AsignacionesRutas);


module.exports = app;


