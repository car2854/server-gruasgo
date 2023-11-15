"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoModel = exports.UsuarioModel = void 0;
class UsuarioModel {
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
    }
}
exports.UsuarioModel = UsuarioModel;
class PedidoModel {
    constructor(idPedido, idCliente, idConductorAceptado, idConductorSolicitud, idConductoresRechazados) {
        this.idPedido = idPedido;
        this.idCliente = idCliente;
        this.idConductorAceptado = idConductorAceptado;
        this.idConductorSolicitud = idConductorSolicitud;
        this.idConductoresRechazados = idConductoresRechazados;
    }
}
exports.PedidoModel = PedidoModel;
