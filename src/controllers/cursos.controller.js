const Cursos = require('../models/cursos.model');
const Asignaciones = require('../models/asignaciones.model');


function AgregarCursos(req, res){
    var parametros = req.body;
    var cursoModel = new Cursos();

    if(req.user.rol =="ROL_ALUMNO")
    return res.status(500).send({ mensaje: 'Solo el alumno tiene acceso'});

    if(parametros.nombreCurso){
        cursoModel.nombreCurso = parametros.nombreCurso;
        cursoModel.idMaestroCurso = req.user.sub;

        cursoModel.save((err, cursoGuardado)=>{
            if (err) return res.status(500).send({ mensaje: "Error en la peticion"});

            if(!cursoGuardado) return res.status(500).send({ mensaje: "Error al guardar el curso"});

            return res.status(200).send({ curso: cursoGuardado });
        });

        Cursos.findOne({ nombreCurso: "CURSO DE"})
    }

}

module.exports = {
    AgregarCursos
}