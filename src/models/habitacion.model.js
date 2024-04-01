const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var habitacionesSchema = Schema({
  nombreHabitacion: String,
  estado: String,
  descripcion: String,
  precio: Number,
  hotelServicios: String,

  stockNoches: Number,

  total: Number,
  

  hotel: { type: Schema.Types.ObjectId, ref: "hoteles" },
});

module.exports = mongoose.model("habitaciones", habitacionesSchema);