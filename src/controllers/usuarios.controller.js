const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

// Registrar administrador por default
function RegistrarMaestroDefecto() {

  var modeloUsuario = new Usuarios();

  Usuarios.find({ nombre: "MAESTRO" }, (err, usuarioEncontrado)=>{
    
    if(usuarioEncontrado.length > 0){



    } else {
        modeloUsuario.nombre = "MAESTRO";
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


// registrar alumno
// return res.status(200) para solicitud exitosa y res.status(500) cuando hay algun error
function RegistrarAlumno(req, res){
    var parametros = req.body;
    var usuarioModel = new Usuarios();
    if(parametros.nombre && parametros.apellido && parametros.email && parametros.password){
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.apellido = parametros.apellido;
        usuarioModel.email = parametros.email;
        usuarioModel.rol = 'ROL_ALUMNO';
        usuarioModel.imagen = null;
        Usuarios.find({ email: parametros.email}, (err, alumnoEncontrado)=>{
            if(alumnoEncontrado.length == 0){
                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                        if(!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al agregar el alumno'});
                        return res.status(200).send({ usuario: usuarioGuardado });
                    });
                });
            } else {
                return res.status(500).send({ mensaje: "El correo ya se encuetra registrado" });
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'Porfavor debe llenar todos los campos' });
    }
}

// editar usuario dependiendo de quien se logea 
function EditarUsuarios(req, res) {

    var idUser = req.params.idUsuario;
    var parametros = req.body;

    if(parametros.nombre&&parametros.apellido){

        Usuarios.findByIdAndUpdate(idUser, {nombre:parametros.nombre,apellido:parametros.apellido}, {new : true},(err, usuarioActualizado)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al editar el Usuario'});
                
                return res.status(200).send({usuario : usuarioActualizado})

            })
       }else{
        return res.status(500).send({ mensaje: 'No puede modificar los campos necesarios para el logueo,solamente nombre y apellido'});
    }
}

// eliminar usuarios

function EliminarUsuarios(req, res){
    var idUsuario = req.params.idUsuario;

    Usuarios.findByIdAndDelete(idUsuario, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: "Erroe en la peticion" });
        if(!usuarioEliminado) return res.status(404).send({ mensaje: "Error al eliminar "});
        return res.status(200).send({ Usuario: usuarioEliminado });
    })
      

}


module.exports = {
    Login,
    RegistrarMaestroDefecto,
    RegistrarAlumno,
    EditarUsuarios,
    EliminarUsuarios
}


