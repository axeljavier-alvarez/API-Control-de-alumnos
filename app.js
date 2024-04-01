// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();


// IMPORTACIONES RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const AdminApp = require('./src/routes/adminApp.routes');
const AdminHotel = require('./src/routes/adminHotel.routes');
// const AdminAppRutas = require('./src/routes/adminApp.routes');


// MIDDLEWARE INTERMEDIARIO
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERA
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuarioRutas, AdminApp, AdminHotel);


module.exports = app;


