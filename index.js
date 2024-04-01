const mongoose = require('mongoose');
const app = require('./app');
const registrarMaestro = require('./src/controllers/usuarios.controller');

// BASE DE DATOS 
mongoose.Promise = global.Promise;                                                                
mongoose.connect('mongodb://127.0.0.1:27017/ControlAlumnos', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");

    
    app.listen(3000, function () {
        console.log('El servidor corre sin problemas')
    })

    registrarMaestro.RegistrarMaestroDefecto();

}).catch(error => console.log(error));
