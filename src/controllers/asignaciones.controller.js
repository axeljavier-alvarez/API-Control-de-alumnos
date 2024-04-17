const Asignaciones = require('../models/asignaciones.model');

function AgregarAsignacion(req, res) {

    var parametros = req.body;
    var cursoModel = new Asignaciones();

    // SOLO EL ALUMNO TIENE ACCESO
    if (req.user.rol !== "ROL_ALUMNO") {
        return res.status(500).send({ mensaje: "Solo el alumno tiene permisos" });
    }

    // ASIGNARSE A CURSO
    if (parametros.idCurso) {
        cursoModel.idCurso = parametros.idCurso;
        cursoModel.idAlumno = req.user.sub;

        Asignaciones.find({ idAlumno: req.user.sub }, (err, cantidadCursos) => {



            // MAXIMO DE 3 CURSOS
            if (cantidadCursos.length < 3) {


                Asignaciones.find({ idCurso: parametros.idCurso, idAlumno: req.user.sub }, (err, asignacionEncontrada) => {
                    if (asignacionEncontrada.length == 0) {
                        cursoModel.save((err, asignacionGuardada) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la petición" });
                            if (!asignacionGuardada) return res.status(500).send({ mensaje: "Erro al guardar la asignacion" });
                            return res.status(200).send({ asignacion: asignacionGuardada });
                        });
                    } else {
                        return res.status(500).send({ mensaje: "Ya se encuentra asignado" });
                    }
                });
            } else {
                return res.status(500).send({ mensaje: "Solo puede asignarse a 3 cursos" });
            }
        });
    } else {
        return res.status(500).send({ mensaje: "Debe rellenar los campo necesarios" });
    }
}


function ObtenerAsignacionesAlumno(req, res){

     // SOLO EL ALUMNO TIENE ACCESO
     if (req.user.rol !== "ROL_ALUMNO") {
        return res.status(500).send({ mensaje: "Solo el alumno tiene permisos" });
    }

    Asignaciones.find((err, asignacionEncontrada)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!asignacionEncontrada) return res.status(500).send({ mensaje: "Error al obtener las asignaciones" });

        return res.status(200).send({ asignacion: asignacionEncontrada });

    }).populate('idCurso', 'nombreCurso')
    .populate('idAlumno', 'nombre apellido email');
}


function ObtenerAsignacionesMaestro(req, res){

    // SOLO EL ALUMNO TIENE ACCESO
    if (req.user.rol !== "ROL_MAESTRO") {
       return res.status(500).send({ mensaje: "Solo el alumno tiene permisos" });
   }

   Asignaciones.find((err, asignacionEncontrada)=>{
       if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
       if(!asignacionEncontrada) return res.status(500).send({ mensaje: "Error al obtener las asignaciones" });

       return res.status(200).send({ asignacion: asignacionEncontrada });

   }).populate('idCurso', 'nombreCurso')
   .populate('idAlumno', 'nombre apellido email');
}

//  ASIGNACIONES DEL ALUMNO POR SU ID
function AsignacionesAlumnoPorId(req, res){
    var idOpcional = req.params.idAlumno;


    if(idOpcional != null && idOpcional){
        Asignaciones.find({idAlumno: idOpcional}, (err, asignacionEncontrada1)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!asignacionEncontrada1) return res.status(500).send({ mensaje: "Error al obtener las asignaciones" });

            return res.status(200).send({ asignacion1: asignacionEncontrada1})
        }).populate('idCurso', 'nombreCurso').populate('idAlumno', 'nombre email');

    } else {
        if ( req.user.rol == "ROL_MAESTRO" ) return res.status(500).send({ mensaje: 'Los maestros deben colocar el ID del alumno en la ruta (ruta opcional)'});

        Asignaciones.find({ idAlumno: req.user.sub}, (err, asignacionEncontrada)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!asignacionEncontrada) return res.status(500).send({ mensaje: "Error al obtener las asignaciones" });

            return res.status(200).send({ asignacion: asignacionEncontrada});
        }).populate('idCurso', 'nombreCurso').populate('idAlumno', 'nombre email');
    }
}

module.exports = {
    AgregarAsignacion,
    ObtenerAsignacionesAlumno,
    ObtenerAsignacionesMaestro,
    AsignacionesAlumnoPorId
}