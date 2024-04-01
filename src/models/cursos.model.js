const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CursosSchema = Schema({
    nombreCurso: String,
    idMaestroCurso: { type: Schema.Types.ObjectId, ref: 'Usuarios'},

});

module.exports = mongoose.model('Cursos', CursosSchema);

