// CONTROLADOR DE USUARIOS
const Usuarios = require('../models/usuario.model');
const Hoteles = require("../models/hoteles.model");
const Habitaciones = require("../models/habitacion.model");
const Eventos = require("../models/eventos.model");
const Reservaciones = require("../models/reservaciones.model");

const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

// editar usuarios







// Buscar usuario por id
function obtenerUsuarioId(req, res) {

  if (req.user.rol !== "ROL_USUARIO") {
    return res.status(500).send({ mensaje: "Solo el rol usuario tiene permisos" });
  }

  var idUsuario = req.params.idUsuario;

  Usuarios.findById(idUsuario, (err, idEncontrado) => {
    if (err)return res.status(500).send({ mensaje: "Error en la peticion del Usuario" });
    if (!idEncontrado) return res.status(500).send({ mensaje: "Error al obtener los datos" });
    return res.status(200).send({ Usuarios: idEncontrado });
  });
}

// Registrar administrador por default
function registrarAdmin() {

  var modeloUsuario = new Usuarios();

  Usuarios.find({ nombreUsuario: "AdminApp" }, (err, usuarioEncontrado) => {

    if (usuarioEncontrado.length > 0) {

    } else {

      modeloUsuario.nombreUsuario = "AdminApp";
      modeloUsuario.email = "AdminApp";
      modeloUsuario.rol = "ROL_ADMIN";

      bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {

        modeloUsuario.password = passwordEncriptada;

        modeloUsuario.save((err, usuarioGuardado) => {


          if (err) return console.log("Error en la peticion");

          if (!usuarioGuardado) return console.log("Error al registrar Admin");

          return console.log("usuario registrado");

        });
      });
    }
  });
}


// Registrar Usuarios
function usuariosRegistrar(req, res) {
    let params = req.body;
    let usuariosModel = new Usuarios();

    if (params.nombreUsuario && params.email && params.password) {
      usuariosModel.nombreUsuario = params.nombreUsuario;
      usuariosModel.email = params.email;
      usuariosModel.password = params.password;
      usuariosModel.hotelHospedado = null;
      usuariosModel.estado = "No hospedado";
      usuariosModel.rol = "ROL_USUARIO";

    Usuarios.find({$and: [{ email: usuariosModel.email }]}).exec((err, usuarioEncontrado) => {

        if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
            
          return res.status(500).send({ mensaje: "El email ya existe" });

        } else {
          bcrypt.hash(params.password, null, null, (err, passwordencriptada) => {

            usuariosModel.password = passwordencriptada;
            usuariosModel.save((err, usuarioRegistrado) => {
              if (usuarioRegistrado) {
                return res.status(200).send({ Usuarios: usuarioRegistrado });
              } else {
                return res.status(500).send({ mensaje: "No se puede registrar" });
              }
            });
          });
        }
      });

     } else {
      return res.status(500).send({ mensaje: "Porfavor llenar todos los campos" });
    } 

   
}

// Logearse
function login(req, res) {

  var parametros = req.body;

  Usuarios.findOne({ email: parametros.email }, (err, emailEncontrado) => {

    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

    if (emailEncontrado) {

      bcrypt.compare(parametros.password, emailEncontrado.password,

        (err, verificacionPassword) => {
          
          if (verificacionPassword) {

            if (parametros.obtenerToken === "true") {

              return res.status(200).send({ token: jwt.crearToken(emailEncontrado) });

            } else {

              emailEncontrado.password = undefined;
              return res.status(200).send({ email: emailEncontrado });
            }
          } else {
            return res.status(500).send({ mensaje: "Las contrasena no coincide" });
          }
        }
      );
    } else {
      return res.status(500).send({ mensaje: "Error, el correo no se encuentra registrado" });
    }
  });
}

// Buscar habitaciones por nombre del hotel
function buscarHabitacionesHotel(req, res) {
  let params = req.body;

  if (req.user.rol !== "ROL_USUARIO") {
    return res.status(500).send({ mensaje: "Solo el rol usuario tiene permisos" });
  }

    if (params.nombre) {
      Hoteles.findOne({ nombre: params.nombre }, (err, hotelEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error interno en la peticion" });
        if (hotelEncontrado) {
          Habitaciones.find({ hotel: hotelEncontrado._id }, (err, habitacionesEncontradas) => {
              if (err)
                return res.status(500).send({ mensaje: "Error interno en la peticion" });
              if (habitacionesEncontradas) {
                return res.status(200).send({ Usuarios: habitacionesEncontradas });
              } else {
                return res.status(500).send({ mensaje: "No encontraron habitaciones" });
              }
            }
          );
        } else {
          return res.status(500).send({ mensaje: "No se encontro el hotel" });
        }
      }

      );
    }
  
}

// Buscar eventos por nombre del hotel, review
function buscarEventosHotel(req, res) {
  let params = req.body;

  if (req.user.rol !== "ROL_USUARIO") {
    return res.status(500).send({ mensaje: "Solo el rol usuario tiene permisos" });
  }
  
    if (params.nombre) {
      Hoteles.findOne({ nombre: params.nombre }, (err, hotelEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error interno al buscar eventos" });
        if (hotelEncontrado) {
          console.log(hotelEncontrado);
          Eventos.find({ hotel: hotelEncontrado._id },(err, eventoEncontrado) => {
              if (err) return res.status(500).send({ mensaje: "Error interno al buscar eventos" });
              if (eventoEncontrado) {
                return res.status(200).send({ Usuarios: eventoEncontrado });
              } else {
                return res.status(500).send({ mensaje: "El hotel no tiene eventos" });
              }
            }
          );
        } else {
          return res.status(500).send({ mensaje: "El hotel no existe" });
        }
      });
    } else {
      return res.status(500).send({ mensaje: "Llene el campo obligatorio" });
    }
  
}

// Reservaciones con el id de la habitacion

function reservacion(req, res) {
  let habitacionID = req.params.habitacionID;
  let reservacionesModel = new Reservaciones();
  let params = req.body;

  if (req.user.rol !== "ROL_USUARIO") {
    return res.status(500).send({ mensaje: "Solo el rol usuario tiene permisos" });
  }

    if (req.user.estado != "Hospedado") {

      reservacionesModel.fechaInicio = params.fechaInicio;
      reservacionesModel.fechaFin = params.fechaFin;
      Usuarios.findOneAndUpdate({ _id: req.user.sub }, { estado: "Hospedado" }, { new: true, useFindAndModify: true }, (err, usuarioActualizado) => {
          if (err)
            return res.status(500).send({ mensaje: "Error al cambiar el estado del usuario" });
          if (usuarioActualizado) {
            reservacionesModel.usuario = usuarioActualizado._id;
            Habitaciones.findOneAndUpdate({ _id: habitacionID }, { estado: "Ocupado" }, { new: true, useFindAndModify: true }, (err, habitacionActualizada) => {
                if (err) return res.status(500).send({mensaje: "No se pudo cambiar el estado de la habitacion"});
                if (habitacionActualizada) {
                  reservacionesModel.habitacion = habitacionActualizada._id;
                  Usuarios.findOneAndUpdate({ _id: req.user.sub },{ hotelHospedado: habitacionActualizada.hotel }, { new: true, useFindAndModify: true }, (err, hotelActualizado) => {
                      if (err) return res.status(500).send({mensaje: "No se pudo actualizar el hotel"});
                      if (hotelActualizado) {
                        Usuarios.findOneAndUpdate();
                        reservacionesModel.save((err, reservacionGuardada) => {
                          if (reservacionGuardada) {
                            return res.status(200).send({ Usuarios: reservacionGuardada });
                          } else {
                            return res.status(500).send({mensaje: "No se pudo guardar la reservacion"});
                          }
                        });
                      } else {
                        return res.status(500).send({ mensaje: "Error al actualizar hotel" });
                      }
                    }
                  );
                }
              }
            );
          } else {
            return res.status(500).send({ mensaje: "No se pudo actualizar" });
          }
        }
      );
    } else {
      return res.status(500).send({ mensaje: "Ya se encuentra hospedado en un hotel" });
    }
  
}

module.exports = {
    registrarAdmin,
    usuariosRegistrar,
    login,
    buscarHabitacionesHotel,
    buscarEventosHotel,
    obtenerUsuarioId,
    reservacion,
    
    
}
