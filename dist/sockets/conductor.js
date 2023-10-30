"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConductorActualizarLatLng = exports.handleConductorOnline = void 0;
const handleConductorOnline = (socket, conductores) => {
    socket.on('conductor online', (payload) => {
        conductores.addConductor({
            id: payload.id,
            idSocket: socket.id,
            lat: payload.lat,
            lng: payload.lng,
            servicio: payload.servicio
        });
        console.log('conectar');
        conductores.mostrarConductores();
    });
};
exports.handleConductorOnline = handleConductorOnline;
const handleConductorActualizarLatLng = (socket, conductores) => {
    socket.on('actualizar', (payload) => {
        conductores.updateLatLngBySocketId({
            socketId: socket.id,
            lat: payload.lat,
            lng: payload.lng
        });
        console.log('actualizar');
        conductores.mostrarConductores();
    });
};
exports.handleConductorActualizarLatLng = handleConductorActualizarLatLng;
