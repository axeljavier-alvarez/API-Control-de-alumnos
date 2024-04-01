const Habitaciones = require("../models/habitacion.model");
const Hoteles = require("../models/hoteles.model");
const Eventos = require("../models/eventos.model");
const Servicios = require("../models/servicios.model");
const Reservaciones = require("../models/reservaciones.model");
const Usuarios = require("../models/usuario.model");
const Factura = require("../models/factura.model");



var eventosModel = new Eventos();
// var serviciosModel = new Servicios();









function agregarHabitacionesNuevo(req, res) {

  let hotelID = req.params.hotelID;

  let params = req.body;
  let habitacionesModel = new Habitaciones();

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

    if (params.nombreHabitacion && params.descripcion && params.hotelServicios && params.precio && params.stockNoches) {

      habitacionesModel.nombreHabitacion = params.nombreHabitacion;
      habitacionesModel.descripcion = params.descripcion;
      habitacionesModel.hotelServicios = params.hotelServicios;
      habitacionesModel.stockNoches = params.stockNoches;
      habitacionesModel.estado = "Disponible";
      habitacionesModel.precio = params.precio;
      habitacionesModel.total = 0;
      // precio * stockNoches



      Hoteles.findById(hotelID, (err, hotelEncontrado) => {

        if (err) return res.status(500).send({ mensaje: "Error interno al comparar administrador" });
        if (!hotelEncontrado) {
          return res.status(500).send({ mensaje: "El administrador no existe" });

        } else {

          Habitaciones.find({ nombreHabitacion: params.nombreHabitacion }, (err, servicioEncontrado) => {

            if (err) return res.status(500).send({ mensaje: "Error interno al comparar hotel" });
            if (servicioEncontrado && servicioEncontrado.length >= 1) {
              return res.status(500).send({ mensaje: "La habitacion ya existe, ingrese otra" });
            } else {

              Habitaciones.find({ hotel: hotelEncontrado },(err, coincidencia) => {
                  if (err) return res.status(500).send({ mensaje: "Error interno" });
                  

                    if (hotelEncontrado) {

                      habitacionesModel.hotel = hotelEncontrado._id;
                      habitacionesModel.save((err, servicioAgregado) => {

                        if (err) return res.status(500).send({ mensaje: "Error interno al agregar hotel" });
                        
                        if (!servicioAgregado)
                          return res.status(500).send({mensaje: "No se ha podido agregar el hotel",});
                        return res.status(200).send({ AdminApp: servicioAgregado });
                      });
                    } else {
                      return res.status(500).send({mensaje: "Solo pueden ser asiganados administradores de hoteles"});
                    }
                  
                }
              );
            }
          });
        }
      });
    } else {
      return res.status(500).send({ mensaje: "Llene todos los campos obligatorios" });
    }
 
}




// Ver hoteles de
/* function verHoteles(req, res) {
  Hoteles.find((err, hotelesEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error interno" });
    if (!hotelesEncontrados)
      return res.status(500).send({ mensaje: "No hay hoteles para visualizar" });
    return res.status(200).send({ hotelesEncontrados });
  });
} */


// Solicitado
/*function habitacionesDisponibles(req, res) {
  let contador = 0;
  let parametros = req.body;
  if (parametros.nombre) {
      Hoteles.findOne({ nombre: parametros.nombre }, (err, hotelEncontrado) => {
          if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
          if (underscore.isEmpty(hotelEncontrado)) return res.status(404).send({ mensaje: 'Error al obtener el hotel' });

          Habitacion.find({ idHotel: hotelEncontrado._id, disponible: true }, (err, habitacioDisponible) => {
              if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
              if (!habitacioDisponible) return res.status(404).send({ mensaje: 'Error al obtener el hotel' });
              habitacioDisponible.forEach(habitaciones => { habitaciones.nombre, contador++; })
              return res.status(200).send({ habitacion: contador })
          })
      })
  } else {
      return res.status(404).send({ mensaje: 'No ha ingresado todos los datos' })
  }
} */



// Hoteles solicitados
/* function hotelesMasSolicitados(req, res) {

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
}


  Habitaciones.find({ solicitado: { $gt: 3 } }, (err, masSolicitados) => {

    if (err) return res.status(500).send({ error: "Error en la peticion" });
    if (masSolicitados.length == 0)
      return res.status(200).send({ AdminHotel: "No hay hoteles muy populares ahora." });

    return res.status(200).send({ AdminHotel: masSolicitados });

  }).sort({ solicitado: -1 });
} */


// Agregar habitaciones
/* function agregarHabitaciones(req, res) {
  var habitacionesModel = new Habitaciones();

  let params = req.body;

  if (req.user.rol !== "ADMIN_HOTEL") {
      return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

    if (params.nombreHabitacion && params.precio && params.descripcion && params.hotelServicios) {

      habitacionesModel.nombreHabitacion = params.nombreHabitacion;
      habitacionesModel.precio = params.precio;
      habitacionesModel.descripcion = params.descripcion;
      habitacionesModel.hotelServicios = params.hotelServicios;
      habitacionesModel.estado = "Disponible";

      Hoteles.findOne({ administradorHotel: req.user.sub }, (err, hotelEncontrado) => {
          if (err) return res.status(500).send({ mensaje: "Error interno al compara IDs" });
          if (hotelEncontrado) {
            habitacionesModel.hotel = hotelEncontrado._id;
            habitacionesModel.save((err, habitacionAgregada) => {
              if (habitacionAgregada) {
                return res.status(200).send({ AdminHotel: habitacionAgregada });
              } else {
                return res.status(500).send({mensaje: "Error al agregar habitaciones"});
              }
            });
          } else {
            return res.status(500).send({ mensaje: "No esta a cargo de ningún hotel" });
          }
        }
      );
    } else {
      return res.status(500).send({ mensaje: "Favor llenar todos los campos" });
    }
    
} */




// Agregar eventos
function agregarEventos(req, res) {
    let params = req.body;

    if (req.user.rol !== "ADMIN_HOTEL") {
        return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
    }

      Hoteles.findOne({ administradorHotel: req.user.sub },(err, hotelAdmin) => {

          if (err)  return res.status(500).send({ mensaje: "Error interno al verificar administrador" });

          if (hotelAdmin) {
            Eventos.find({$and: [{ nombre: params.nombre }, { hotel: hotelAdmin._id }],}).exec((err, eventoEncontrado) => {

              if (err) return res.status(500).send({ mensaje: "Error interno" });
              if (eventoEncontrado && eventoEncontrado.length >= 1) {
                return res.status(500).send({ mensaje: "El eventos ya existe en este hotel" });
              } else {
                eventosModel.nombre = params.nombre;
                eventosModel.descripcion = params.descripcion;
                eventosModel.hotel = hotelAdmin._id;
                eventosModel.save((err, eventoAgregado) => {
                  if (eventoAgregado) {
                    return res.status(200).send({ AdminHotel: eventoAgregado });
                  } else {
                    return res.status(500).send({ mensaje: "Error al agregar evento" });
                  }
                });
              }
            });
          } else {
            return res.status(500).send({ mensaje: "El administrador no esta a cargo de un hotel" });
          }
        }
      );
    
}

// Ver eventos
function verEventos(req, res) {

    if (req.user.rol !== "ADMIN_HOTEL") {
        return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
    }

      Hoteles.findOne({ administradorHotel: req.user.sub }, (err, adminEncontrado) => {
          if (err)
            return res.status(500).send({ mensaje: "Erro interno al verificar el hotel" });
          if (adminEncontrado) {
            Eventos.find({ hotel: adminEncontrado._id }, (err, eventoEncontrado) => {
                if (err)
                  return res.status(500).send({ mensaje: "Error interno al buscar habitaciones" });
                if (eventoEncontrado) {
                  return res.status(200).send({ AdminHotel: eventoEncontrado });
                } else {
                  return res.status(500).send({ mensaje: "Todas las habitaciones estan ocupadas" });
                }
              }
            );
          }
        }
      );
    
}

// agregar servicios
/*function agregarServicios(req, res) {


    let params = req.body;
    var serviciosModel = new Servicios();

    if (req.user.rol !== "ADMIN_HOTEL") {
        return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
    }


      serviciosModel.nombreServicio = params.nombreServicio;
      serviciosModel.descripcionServicio = params.descripcionServicio;

      Hoteles.findOne({ administradorHotel: req.user.sub }, (err, hotelAdmin) => {

          if (err)return res.status(500).send({ mensaje: "Error interno al verificar administrador" });
          if (hotelAdmin) {
            Servicios.find({$and: [{ nombreServicio: params.nombre },{ hotel: hotelAdmin._id },],}).exec((err, servicioEncontrado) => {
              if (err) return res.status(500).send({ mensaje: "Error" });
              if (servicioEncontrado && servicioEncontrado.length >= 1) {
                return res.status(500).send({ mensaje: "El servicio ya existe en este hotel" });
              } else {
                serviciosModel.hotel = hotelAdmin._id;
                serviciosModel.save((err, servicioAgregado) => {
                  if (servicioAgregado) {
                    return res.status(200).send({ AdminHotel: servicioAgregado });
                  } else {
                    return res.status(500).send({ mensaje: "Error al agregar servicio" });
                  }
                });
              }
            });
          } else {
            return res.status(500).send({ mensaje: "Este administrador no esta a cargo de un hotel" });
          }
        }
      );
   
} */

// agregar servicios a determinados hoteles
function agregarServiciosNuevo(req, res) {

  let hotelID = req.params.hotelID;

  let params = req.body;
  let serviciosModel = new Servicios();

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

    if (params.nombreServicio && params.descripcionServicio) {

      serviciosModel.nombreServicio = params.nombreServicio;
      serviciosModel.descripcionServicio = params.descripcionServicio;


      Hoteles.findById(hotelID, (err, hotelEncontrado) => {

        if (err) return res.status(500).send({ mensaje: "Error interno al comparar administrador" });
        if (!hotelEncontrado) {
          return res.status(500).send({ mensaje: "El administrador no existe" });

        } else {

          Servicios.find({ nombreServicio: params.nombreServicio }, (err, servicioEncontrado) => {

            if (err) return res.status(500).send({ mensaje: "Error interno al comparar hotel" });
            if (servicioEncontrado && servicioEncontrado.length >= 1) {
              return res.status(500).send({ mensaje: "El servicio ya existe" });
            } else {
              Servicios.find({ hotel: hotelEncontrado },(err, coincidencia) => {
                  if (err) return res.status(500).send({ mensaje: "Error interno" });
                  

                    if (hotelEncontrado) {

                      serviciosModel.hotel = hotelEncontrado._id;
                      serviciosModel.save((err, servicioAgregado) => {

                        if (err) return res.status(500).send({ mensaje: "Error interno al agregar hotel" });
                        if (!servicioAgregado)
                          return res.status(500).send({mensaje: "No se ha podido agregar el hotel",});
                        return res.status(200).send({ AdminApp: servicioAgregado });
                      });
                    } else {
                      return res.status(500).send({mensaje: "Solo pueden ser asiganados administradores de hoteles"});
                    }
                  
                }
              );
            }
          });
        }
      });
    } else {
      return res.status(500).send({ mensaje: "Llene todos los campos obligatorios" });
    }
 
}

// ver servicios
function verServicios(req, res) {

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

    Hoteles.findOne({ administradorHotel: req.user.sub }, (err, adminEncontrado) => {

        if (err) return res.status(500).send({ mensaje: "Error al verificar el hotel" });
        if (adminEncontrado) {
          Servicios.find({ hotel: adminEncontrado._id },(err, servicioEncontrados) => {
              if (err) return res.status(500).send({ mensaje: "Error al buscar las habitaciones" });
              if (servicioEncontrados) {
                return res.status(200).send({ AdminHotel: servicioEncontrados });
              } else {
                return res.status(500).send({ mensaje: "Las habitaciones estan ocupadas" });
              }
            }
          );
        }
      }
    );
  
}

// buscar habitaciones disponibles, no esta bien, arreglarlo
function verHabitacionesDisponibles(req, res) {

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

  
  

    
}
  


// Ver reservaciones dependiendo del administrador del hotel, se podran ver
function verReservaciones(req, res) {

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

    Hoteles.findOne({ administradorHotel: req.user.sub }, (err, hotelAdmin) => {
        if (err) return res.status(500).send({ mensaje: "Erro interno al verificar el hotel" });
        if (hotelAdmin) {
          Habitaciones.findOne({ hotel: hotelAdmin._id }, (err, habitacionEncontrada) => {
              if (err) return res.status(500).send({ mensaje: "Error al verificar" });
              if (habitacionEncontrada) {
                Reservaciones.find({ habitacion: habitacionEncontrada._id }, (err, reservacionesEncontradas) => {
                    if (err) return res.status(500).send({mensaje: "Error interno al buscar reservaciones"});
                    if (reservacionesEncontradas) {
                      return res.status(200).send({ AdminHotel: reservacionesEncontradas });
                    } else {
                      return res.status(500).send({mensaje: "No hay reservaciones hechas en este hotel",});
                    }
                  }
                );
              } else {
                return res.status(500).send({ mensaje: "Error al verificar" });
              }
            }
          );
        } else {
          return res.status(500).send({ mensaje: "El administrador no esta a cargo de un hotel" });
        }
      }
    );
  
}

// Opcion b de obtener las reservaciones
function ObtenerReservaciones(req, res) {

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

  const idHotel = req.params.idHotel;

  Reservaciones.find({ idHotel: idHotel },(err, reservacionEncontrada) => {

      return res.status(200).send({ AdminHotel: reservacionEncontrada });
    }
  );

}

// Datos del rol usuario al momento de buscar hospedado método post
function buscarHospedajes(req, res) {

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

  let params = req.body;
    Hoteles.findOne({ administradorHotel: req.user.sub },(err, hotelAdmin) => {
        if (err)
          return res.status(500).send({ mensaje: "Error interno al verificar hotel" });
        if (hotelAdmin) {

        Usuarios.findOne({$and: [{ usuario: params.buscar }, { hotelHospedado: hotelAdmin._id }],}).exec((err, usuarioEncontrado) => {
            if (err)
              return res.status(500).send({ mensaje: "Error interno al verificar cliente" });
            if (usuarioEncontrado) {
              return res.status(200).send({ AdminHotel: usuarioEncontrado });
            } else {
              return res.status(500).send({ mensaje: "El cliente no se encuentra en su hotel" });
            }
          });
        } else {
          return res.status(500).send({ mensaje: "Usted no esta acargo de ningun hotel" });
        }
      }
    );
  
}

// Ver hospedaje método get
function verHospedajes(req, res) {

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

    Hoteles.findOne({ administradorHotel: req.user.sub }, (err, hotelAdmin) => {

        if (err) return res.status(500).send({mensaje: "No se pudo verificar el administrador del hotel"});
        if (hotelAdmin) {
          Usuarios.find({ hotelHospedado: hotelAdmin._id }, (err, hospedajesEncontrados) => {
              if (err)
                return res.status(500).send({ mensaje: "No se pudo verificar los usuarios" });
              if (hospedajesEncontrados) {
                return res.status(200).send({ AdminHotel: hospedajesEncontrados });
              } else {
                return res.status(500).send({ mensaje: "No hay clientes en este hotel" });
              }
            }
          );
        } else {
          return res.status(500).send({ mensaje: "No esta a cargo de ningún hotel" });
        }
      }
    );
  
}


// Factura
function facturar(req, res) {
  let idReservacion = req.params.idReservacion;
  var facturaModel = new Factura();

  if (req.user.rol !== "ADMIN_HOTEL") {
    return res.status(500).send({ mensaje: "Solo el administrador del hotel tiene permisos" });
  }

    Factura.findOne({ reservacion: idReservacion }, (err, facturaEncontrada) => {
        if (!facturaEncontrada) {

          Reservaciones.findById(idReservacion, (err, reservacionEncontrada) => {
              if (err) return res.status(500).send({ mensaje: "Error interno" });
              if (reservacionEncontrada) {
                facturaModel.reservacion = reservacionEncontrada._id;
                facturaModel.usuario = reservacionEncontrada.usuario;
                facturaModel.fechaInicio = reservacionEncontrada.fechaInicio;
                facturaModel.fechaFin = reservacionEncontrada.fechaFin;


                


                Habitaciones.findById({ _id: reservacionEncontrada.habitacion }, (err, habitacionEncontrada) => {

                  
                    if (err) return res.status(500).send({ mensaje: "Error interno" });
                    if (habitacionEncontrada) {
                      facturaModel.habitacion = habitacionEncontrada._id;
                      facturaModel.total = habitacionEncontrada.precio;
                      facturaModel.servicioHotel = habitacionEncontrada.hotelServicios;

                      


                      Hoteles.findById( habitacionEncontrada.hotel, (err, hotelEncontrado) => {
                          if (err) return res.status(500).send({ mensaje: "Error interno" });
                          if (hotelEncontrado) {

                            Servicios.find({ hotel: hotelEncontrado._id },(err, serviciosEncontrados) => {

                              //facturaModel.servicioHotel = serviciosEncontrados.nombreServicio;

                                if (err) return res.status(500).send({ mensaje: "Error interno" });
                                if (serviciosEncontrados) {


                                  var servicios; 
                                  for ( let i = 0; i < serviciosEncontrados.length; i++) {
                                    servicios = serviciosEncontrados[i]._id;
                                    //servicios = serviciosEncontrados[i].nombreServicio;
                                    facturaModel.servicios.push(
                                      serviciosEncontrados[i]._id,
                                      // serviciosEncontrados[i].nombreServicio,
                                  
                                    );
                                    facturaModel.save(
                                      (err, facturaGuardada) => {
                                        if (err)return res.status(500).send({mensaje: "Error en la petición"});

                                        if (!facturaGuardada)
                                          return res.status(500).send({mensaje: "Error al guardar la factura"});

                                        return res.status(200).send({ AdminHotel: facturaGuardada });
                                      }
                                    );
                                  }
                                } else {
                                  return res.status(500).send({ mensaje: "No hay servicios" });
                                }


                              }
                            );

                            

                            
                          } else {
                            return res.status(500).send({ mensaje: "No hay hotel" });
                          }
                        }
                      );


                                                   


                    } else {
                      return res.status(500).send({ mensaje: "No se encontro la habitacion" });
                    }

                  
                  }
                );

              
                
              } else {
                return res.status(500).send({ mensaje: "Error interno" });
              }
            

            }
          );

          
        } else {
          return res.status(500).send({ mensaje: "Ya existe una factura creada" });
        }
      }
    )
  
}






module.exports = {
    // agregarHabitaciones,
    agregarEventos,
    verEventos,
    // agregarServicios,
    verServicios,
    verHabitacionesDisponibles,
    verReservaciones,
    ObtenerReservaciones,
    buscarHospedajes,
    verHospedajes,
    facturar,
    agregarServiciosNuevo,
    agregarHabitacionesNuevo,
    
    
    
}