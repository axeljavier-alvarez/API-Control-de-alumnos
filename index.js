const mongoose = require('mongoose');
const app = require('./app');
const registroAdmin = require('./src/controllers/usuario.controller')


// BASE DE DATOS 
mongoose.Promise = global.Promise;                                                                
mongoose.connect('mongodb://localhost:27017/HotelesGrupo2_IN6BM', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");

    app.listen(3000, function () {
        console.log('El servidor corre sin problemas')
    })

    registroAdmin.registrarAdmin();


}).catch(error => console.log(error));

