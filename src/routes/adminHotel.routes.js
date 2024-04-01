const express = require('express');
const adminHotelController = require('../controllers/adminHotel.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

// ver hoteles
// api.get("/masSolicitados", md_autenticacion.Auth, adminHotelController.hotelesMasSolicitados);






// disponibilidad
api.get("/verHabitacionesDisponibles", md_autenticacion.Auth, adminHotelController.verHabitacionesDisponibles)

// agregar habitaciones
// api.post("/agregarHabitaciones", md_autenticacion.Auth, adminHotelController.agregarHabitaciones);

// agregar eventos
api.post("/agregarEventos", md_autenticacion.Auth, adminHotelController.agregarEventos);

// ver eventos
api.get('/verEventos', md_autenticacion.Auth, adminHotelController.verEventos);

// agregar servicios revisarlo
// api.post("/agregarServicios", md_autenticacion.Auth, adminHotelController.agregarServicios);

// ver servicios
api.get('/verServicios', md_autenticacion.Auth, adminHotelController.verServicios);

// ver habitaciones disponibles
api.get('/verHabitacionesDisponibles', md_autenticacion.Auth, adminHotelController.verHabitacionesDisponibles);

// ver reservaciones
api.get('/verReservaciones', md_autenticacion.Auth, adminHotelController.verReservaciones);

// obtener reservaciones opcion 2
api.get('/obtenerReservaciones/:idHotel', md_autenticacion.Auth, adminHotelController.ObtenerReservaciones);

// buscar hospedajes
api.post("/buscarHospedajes", md_autenticacion.Auth, adminHotelController.buscarHospedajes);

// ver hospedajes
api.get("/verHospedajes", md_autenticacion.Auth, adminHotelController.verHospedajes);

// factura
api.post("/factura/:idReservacion", md_autenticacion.Auth, adminHotelController.facturar);

// nuevo agregar servicios
// api.post("/nuevoAgregarServicios/:hotelID", md_autenticacion.Auth, adminHotelController.agregarServiciosNuevo);

// Agregar servicios nuevo
api.post("/agregarServiciosNuevo/:hotelID", md_autenticacion.Auth, adminHotelController.agregarServiciosNuevo);


// Agregar habitaciones nuevo

api.post("/agregarHabitacionesNuevo/:hotelID", md_autenticacion.Auth, adminHotelController.agregarHabitacionesNuevo);

module.exports = api;
