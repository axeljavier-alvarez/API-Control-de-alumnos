// MODELO DE USUARIO
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let usuariosSchema = Schema({

  nombreUsuario: String,
  email: String,
  password: String,
  estado: String,
  rol: String,
  hotelHospedado: { type: Schema.Types.ObjectId, ref: "hoteles" },

});

module.exports = mongoose.model("usuarios", usuariosSchema);