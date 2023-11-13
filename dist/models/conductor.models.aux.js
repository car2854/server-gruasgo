"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteModel = exports.UsuarioModel = exports.PedidoModel = exports.ConductorModel = void 0;
class UsuarioModel {
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
    }
}
exports.UsuarioModel = UsuarioModel;
class ConductorModel extends UsuarioModel {
    constructor(id, socket, lat, lng, servicio, pedidoAceptado, pedidosRechazados, pedidoEnEspera) {
        super(id, socket);
        this.id = id;
        this.socket = socket;
        this.lat = lat;
        this.lng = lng;
        this.servicio = servicio;
        this.pedidoAceptado = pedidoAceptado;
        this.pedidosRechazados = pedidosRechazados;
        this.pedidoEnEspera = pedidoEnEspera;
    }
}
exports.ConductorModel = ConductorModel;
class PedidoModel {
    constructor(id) {
        this.id = id;
    }
}
exports.PedidoModel = PedidoModel;
class ClienteModel extends UsuarioModel {
    constructor(id, socket) {
        super(id, socket);
        this.id = id;
        this.socket = socket;
    }
}
exports.ClienteModel = ClienteModel;
