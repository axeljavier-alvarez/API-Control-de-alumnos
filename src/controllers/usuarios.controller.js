const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

// Registrar administrador por default
function RegistrarMaestroDefecto() {

  var modeloUsuario = new Usuarios();

  Usuarios.find({ nombre: "Javier" }, (err, usuarioEncontrado)=>{
    
    if(usuarioEncontrado.length > 0){


    } else {
        modeloUsuario.nombre = "Javier";
        modeloUsuario.apellido = "Felipe";
        modeloUsuario.password = "123456";
        modeloUsuario.email = "maestro@gmail.com";
        modeloUsuario.rol = "ROL_MAESTRO";
        modeloUsuario.imagen = null;

        bcrypt.hash("123456", null, null, (err, passwordEncriptada)=>{
            modeloUsuario.password = passwordEncriptada;
            modeloUsuario.save((err, usuarioGuardado)=>{

                if(err) return console.log("Error en la peticion");

                if(!usuarioGuardado) return console.log("Error al registrar Admin ");
                
                return console.log("Usuario registrado con exito ");

            })
        })

    }
  });
}



// LOGIN
function Login(req, res) {

    var parametros = req.body;

    Usuarios.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {//TRUE OR FALSE
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return res.status(200).send({ Usuario: usuarioEncontrado })
                        }


                    } else {
                        return res.status(500).send({ mensaje: 'La contraseña no es correcta, intentalo de nuevo' });
                    }
                })

        } else {
            return res.status(500).send({ mensaje: 'Error, el correo no se encuentra, intentelo de nuevo' })
        }
    })
}






module.exports = {
    Login,
    RegistrarMaestroDefecto,
}


