// MODELO DE USUARIOS
const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({


    nombre: String,
    apellido: String, 
    email: String,
    password: String,
    rol: String,
    direccion: String,
    edad: Number, 


});

module.exports = mongoose.model('Usuarios',UsuariosSchema);