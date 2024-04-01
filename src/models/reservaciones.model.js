const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reservasSchema = Schema({

  usuario: { type: Schema.Types.ObjectId, ref: "usuarios" },
  fechaInicio: String,
  fechaFin: String,
  hotel: { type: Schema.Types.ObjectId, ref: "hoteles"},
  habitacion: { type: Schema.Types.ObjectId, ref: "habitaciones" },
  
});

module.exports = mongoose.model("reservaciones", reservasSchema);