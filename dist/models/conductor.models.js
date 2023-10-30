"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConductorModels {
    constructor(id, socketId, lat, lng, servicio, status, cliente) {
        this.id = id;
        this.socketId = socketId;
        this.lat = lat;
        this.lng = lng;
        this.servicio = servicio;
        this.status = status;
        this.cliente = cliente;
    }
}
exports.default = ConductorModels;
