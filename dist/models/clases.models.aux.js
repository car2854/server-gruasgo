"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoModel = exports.ConductorModel = void 0;
class ConductorModel {
    constructor(id, socket, lat, lng, estado, servicio) {
        this.id = id;
        this.socket = socket;
        this.lat = lat;
        this.lng = lng;
        this.estado = estado;
        this.servicio = servicio;
    }
}
exports.ConductorModel = ConductorModel;
class PedidoModel {
    constructor(idPedido, socket, idConductorAceptado, idConductoresRechazados) {
        this.idPedido = idPedido;
        this.socket = socket;
        this.idConductorAceptado = idConductorAceptado;
        this.idConductoresRechazados = idConductoresRechazados;
    }
}
exports.PedidoModel = PedidoModel;
