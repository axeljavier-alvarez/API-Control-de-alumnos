const Cursos = require('../models/cursos.model');
const Asignaciones = require('../models/asignaciones.model');


// AGREGAR CURSOS DEL ALUMNO
function AgregarCursos(req, res) {
    if (req.user.rol !== "ROL_ALUMNO") {
        return res.status(500).send({ mensaje: "Solo el alumno tiene permisos" });
    }

    var parametros = req.body;
    var cursoModel = new Cursos();

    cursoModel.nombreCurso = parametros.nombreCurso;
    cursoModel.idMaestroCurso = req.user.sub;

    Cursos.findOne({ nombreCurso: cursoModel.nombreCurso }, (err, cursoEncontrado) => {

        if (err) return res.status(500).send({ mensaje: "Error al consultar" });
        if (cursoEncontrado) return res.status(500).send({ mensaje: "Este curso ya esta asignado" });

        cursoModel.save((err, cursoGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

            if (!cursoGuardado) return res.status(500).send({ mensaje: "Error al guardar el curso" });

            return res.status(200).send({ curso: cursoGuardado });
        });
    });
}

function EditarCursos(req, res) {
    var idCur = req.params.idCurso;
    var parametros = req.body;

    if ( req.user.rol == "ROL_ALUMNO" ) return res.status(500)
    .send({ mensaje: 'Solo el profesor puede editar los cursos'});

    Cursos.findByIdAndUpdate(idCur, parametros, { new: true } ,(err, cursosActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!cursosActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Cursos'});

        return res.status(200).send({ curso: cursosActualizado});
    });
}

// TODOS LOS CURSOS LOS PUEDE OBTENER CUALQUIER ROL
function ObtenerTodosLosCursos(req, res) {


    Cursos.find({}, (err, cursosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!cursosEncontrados) return res.status(500).send({ mensaje: "Error al obtener los cursos" });

        return res.status(200).send({ curso: cursosEncontrados });

    }).populate('idMaestroCurso', 'nombre email')
}

// OBTENER CURSOS PROFESOR
function ObtenerCursosProfesor(req, res) {

    // SOLO EL PROFESOR TIENE ACCESO
    if (req.user.rol !== "ROL_MAESTRO") {
        return res.status(500).send({ mensaje: "Solo el maestro tiene permisos" });
    }

    Cursos.find({ idMaestroCurso: req.user.sub }, (err, cursosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición " });
        if (!cursosEncontrados) return res.status(500).send({ mensaje: "Error al obtener los cursos" });
        return res.status(200).send({ curso: "Cursos encontrados" });
    }).populate('idMaestroCurso', 'nombre email')
}










module.exports = {
    AgregarCursos,
    ObtenerTodosLosCursos,
    ObtenerCursosProfesor,
    EditarCursos
}