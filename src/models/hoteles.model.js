const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var hotelesSchema = Schema({
  nombre: String,
  direccion: String,
  descripcion: String,
  administradorHotel: {type: Schema.Types.ObjectId, ref: "usuarios"},
});

module.exports = mongoose.model("hoteles", hotelesSchema);