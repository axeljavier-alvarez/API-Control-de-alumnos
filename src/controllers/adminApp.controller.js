const Usuarios = require("../models/usuario.model");
const Hoteles = require("../models/hoteles.model");
const bcrypt = require("bcrypt-nodejs");
const underscore = require('underscore')

// Editar usuarios




// Obtener usuarios rol Admin Hotel
function obtenerUsuariosAdminHotel(req, res) {

  if (req.user.rol !== "ROL_ADMIN") {
    return res.status(500).send({ mensaje: "Solo el administrador tiene permisos" });
  }

  Usuarios.find({rol: "ADMIN_HOTEL"},(err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: 'Error al buscar los hoteles' })
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: 'No existen hoteles' })

    return res.status(200).send({ AdminApp: usuariosEncontrados })
})
}


// ObtenerUsuarios
function obtenerUsuarios(req, res) {

  if (req.user.rol !== "ROL_ADMIN") {
    return res.status(500).send({ mensaje: "Solo el administrador tiene permisos" });
  }

  Usuarios.find({rol: "ROL_USUARIO"},(err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: 'Error al buscar los usuarios' })
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: 'No existen hoteles' })

    return res.status(200).send({ Usuarios: usuariosEncontrados })
})

}


// Ver hoteles
function verHoteles(req, res) {
  Hoteles.find((err, hotelesEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error interno" });
    if (!hotelesEncontrados)
      return res.status(500).send({ mensaje: "No hay hoteles para visualizar" });
    return res.status(200).send({ AdminApp: hotelesEncontrados });
  });
}




// VER USUARIOS
function verUsuarios(req, res) {

  if (req.user.rol !== "ROL_ADMIN") {
    return res.status(500).send({ mensaje: "Solo el administrador de la aplicacion tiene permisos" });
  }

    Usuarios.find((err, usuariosEncontrados) => {

      if (err) return res.status(500).send({ mensaje: "Error interno al buscar usuarios" });
      if (!usuariosEncontrados)
        return res.status(500).send({ mensaje: "No hay usuarios registrados" });
      return res.status(200).send({ AdminApp: usuariosEncontrados });
    });
  
}


// AGREGAR ADMINISTRADOR DEL HOTEL
function agregarAdministradorHotel(req, res) {


    let params = req.body;
    let usuariosModel = new Usuarios();

    if (req.user.rol !== "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el administrador de la aplicacion tiene permisos" });
    }

      if (params.nombreUsuario && params.email && params.password) {

        
        usuariosModel.nombreUsuario = params.nombreUsuario;
        usuariosModel.email = params.email;
        usuariosModel.rol = "ADMIN_HOTEL";
        
        Usuarios.find({ email: params.email }, (err, usuarioEncontrado) => {

          if (err) return res.status(500).send({ mensaje: "Erro interno al compara usuarios" });

          if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
            return res.status(500).send({ mensaje: "El administrador ya existe" });

          } else {
            bcrypt.hash(params.password, null, null, (err, encriptada) => {
              usuariosModel.password = encriptada;
              usuariosModel.save((err, adminRegistrado) => {
                if (adminRegistrado) {
                  return res.status(200).send({ AdminApp: adminRegistrado });
                } else {
                  return res.status(500).send({ mensaje: "Error interno al registar" });
                }
              });
            });
          }
        });
      } else {
        return res.status(500).send({ mensaje: "Llene los campos necesarios" });
      }
   
}

// AGREGAR HOTELES ROL ADMIN
function agregarHotel(req, res) {

  let administradorID = req.params.administradorID;

  let params = req.body;
  let hotelesModel = new Hoteles();

  if (req.user.rol === "ROL_ADMIN") {

    if (params.nombre && params.direccion && params.descripcion) {

      hotelesModel.nombre = params.nombre;
      hotelesModel.direccion = params.direccion;
      hotelesModel.descripcion = params.descripcion;


      Usuarios.findById(administradorID, (err, adminEncontrado) => {

        if (err) return res.status(500).send({ mensaje: "Error interno al comparar administrador" });
        if (!adminEncontrado) {
          return res.status(500).send({ mensaje: "El administrador no existe" });

        } else {
          Hoteles.find({ nombre: params.nombre }, (err, hotelEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error interno al comparar hotel" });
            if (hotelEncontrado && hotelEncontrado.length >= 1) {
              return res.status(500).send({ mensaje: "El hotel ya existe" });
            } else {
              Hoteles.find({ administradorHotel: adminEncontrado },(err, coincidencia) => {
                  if (err) return res.status(500).send({ mensaje: "Error interno" });
                  if (coincidencia && coincidencia.length >= 1) {
                    return res.status(500).send({mensaje: "El administrador ya ha sido asignado a un hotel"});
                  } else {

                    if (adminEncontrado.rol === "ADMIN_HOTEL") {

                      hotelesModel.administradorHotel = adminEncontrado._id;
                      hotelesModel.save((err, hotelAgregado) => {

                        if (err) return res.status(500).send({ mensaje: "Error interno al agregar hotel" });
                        if (!hotelAgregado)
                          return res.status(500).send({mensaje: "No se ha podido agregar el hotel",});
                        return res.status(200).send({ AdminApp: hotelAgregado });
                      });
                    } else {
                      return res.status(500).send({mensaje: "Solo pueden ser asiganados administradores de hoteles"});
                    }
                  }
                }
              );
            }
          });
        }
      })

    } else {
      return res.status(500).send({ mensaje: "Llene todos los campos obligatorios" });
    }
  } else {
    return res.status(500).send({ mensaje: "Funcion exclusiva para administradores de la app" });
  }
}

// VER HOTELES ROL ADMIN

function verHotelesAdminApp(req, res) {

  if (req.user.rol !== "ROL_ADMIN") {
    return res.status(500).send({ mensaje: "Solo el administrador de la aplicacion tiene permisos" });
  }

    Hoteles.find((err, hotelesEncontrados) => {

      if (err) return res.status(500).send({ mensaje: "Error al buscar" });
      if (hotelesEncontrados) {
        return res.status(200).send({ AdminApp: hotelesEncontrados });
      } else {
        return res.status(500).send({ mensaje: "No hay hoteles disponibles" });
      }
    });
  
}


// EDITAR LOS USUARIOS

function editarUsuarios(req, res) {
  
  let usuarioID = req.params.usuarioID;
  let params = req.body;
  
  delete params.password;
  delete params.rol;
  delete params._id;
  delete params.estado;
  delete params.hotelHospedado;


  if (req.user.rol !== "ROL_ADMIN") {
    return res.status(500).send({ mensaje: "Solo el administrador de la aplicacion tiene permisos" });
  }

    Usuarios.findByIdAndUpdate({ _id: usuarioID }, params,{ new: true },(err, usuarioActualizado) => {

        if (err) return res.status(500).send({ mensaje: "Error interno" });
        if (usuarioActualizado) {
          return res.status(200).send({ AdminApp: usuarioActualizado });
        } else {
          return res.status(500).send({ mensaje: "Error al actualizar" });
        }
      }
    );
  
}

// ELIMINAR LOS USUARIOS
function eliminarUsuarios(req, res) {
  let usuarioID = req.params.usuarioID;

  if (req.user.rol !== "ROL_ADMIN") {
    return res.status(500).send({ mensaje: "Solo el administrador de la aplicacion tiene permisos" });
  }


    Hoteles.findOne({ administradorHotel: usuarioID }, (err, adminEncontrado) => {

        if (err) return res.status(500).send({ mensaje: "Error interno" });
        if (adminEncontrado) {
          return res.status(500).send({mensaje: "No lo puede eliminar porque administra un hotel"});
        } else {
          Usuarios.findById(usuarioID, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error" });
            if (usuarioEncontrado.estado === "Hospedado") {
              return res.status(500).send({ mensaje: "El usuario esta eliminado y no se puede eliminar" });
            } else {
              Usuarios.findByIdAndDelete(usuarioEncontrado, (err, usuarioEliminado) => {

                  if (err)return res.status(500).send({ mensaje: "Error" });
                  if (usuarioEliminado.estado === "Hospedado") {
                    return res.status(500).send({ mensaje: "No puede eliminar a un usuario hospedado"});
                  } else {
                    return res.status(200).send({ AdminApp: usuarioEliminado });
                  }
                }
              );
            }
          });
        }
      }
    );
  
}

// EDITAR HOTELES
function editarHoteles(req, res) {

  if (req.user.rol !== "ROL_ADMIN") {
    return res.status(500).send({ mensaje: "Solo el administrador de la aplicacion tiene permisos" });
  }

    let hotelID = req.params.hotelID;
    let params = req.body;
    delete params._id;
    delete params.administradorHotel;

    Hoteles.findByIdAndUpdate({ _id: hotelID }, params, { new: true }, (err, hotelActualizado) => {

        if (err) return res.status(500).send({ mensaje: "Error interno" });
        if (hotelActualizado) {
          return res.status(200).send({ AdminApp: hotelActualizado });
        } else {
          return res.status(500).send({ mensaje: "Error al actualizar" });
        }
      }
    );
  
}

// ELIMINAR HOTELES
function eliminarHoteles(req, res) {

  let hotelID = req.params.hotelID;

  if (req.user.rol !== "ROL_ADMIN") {
    return res.status(500).send({ mensaje: "Solo el administrador de la aplicacion tiene permisos" });
  }

    Usuarios.find({ hotelHospedado: hotelID }, (err, hotelEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Se produjo un error" });
      if (hotelEncontrado._id === hotelID) {
        return res.status(500).send({mensaje: "No puede eliminar el hotel porque hay clientes hospedados"});
      } else {
        Hoteles.findByIdAndDelete({ _id: hotelID }, (err, hotelEliminado) => {
          if (err) return res.status(500).send({ mensaje: "Error interno" });
          if (hotelEliminado) {
            return res.status(200).send({ AdminApp: hotelEliminado });
          } else {
            return res.status(500).send({ mensaje: "No se pudo eliminar el hotel" });
          }
        });
      }
    });
  
}


module.exports = {
    agregarAdministradorHotel,
    verUsuarios,
    agregarHotel,
    verHotelesAdminApp,
    editarUsuarios,
    eliminarUsuarios,
    editarHoteles,
    eliminarHoteles,
    //HotelesContando
    verHoteles,
    obtenerUsuariosAdminHotel,
    obtenerUsuarios


}