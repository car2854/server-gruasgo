"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conductors = void 0;
class Conductors {
    constructor() {
        this.conductores = [];
        this.pedidos = [];
        this.getConductorById = (id) => this.conductores.find((conductor) => conductor.id === id);
        this.getPedidoByIdPedido = (idPedido) => this.pedidos.find((pedido) => pedido.idPedido === idPedido);
        this.agregarNuevoConductor = (conductor) => {
            if (this.getConductorById(conductor.id) == null) {
                const existe = this.pedidos.some((pedido) => pedido.idConductorAceptado === conductor.id);
                if (existe)
                    conductor.estado = 'ocupado';
                this.conductores.push(conductor);
            }
        };
        this.agregarPedido = (pedido) => {
            if (!this.getPedidoByIdPedido(pedido.idPedido) == null) {
                this.pedidos.push(pedido);
            }
        };
        this.actualizarSocketPedido = (data) => {
            const pedido = this.getPedidoByIdPedido(data.id);
            if (pedido) {
                pedido.socket = data.nuevoSocket;
            }
        };
        this.actualizarSocketConductor = (data) => {
            const conductor = this.getConductorById(data.id);
            if (conductor) {
                conductor.socket = data.nuevoSocket;
            }
        };
        this.pedidoRechazado = (data) => {
            const pedido = this.getPedidoByIdPedido(data.idPedido);
            if (pedido) {
                pedido.idConductoresRechazados.push(data.idConductor);
            }
        };
        this.pedidoAceptado = (data) => {
            const pedido = this.getPedidoByIdPedido(data.idPedido);
            if (pedido) {
                pedido.idConductorAceptado = data.idConductor;
            }
        };
        this.eliminarPedido = (idPedido) => {
            const pedido = this.getPedidoByIdPedido(idPedido);
            if (pedido) {
                this.pedidos = this.pedidos.filter((data) => data !== pedido);
            }
        };
        this.actualizarCoordenadas = (data) => {
            const conductor = this.getConductorById(data.idConductor);
            if (conductor) {
                conductor.lat = data.lat;
                conductor.lng = data.lng;
            }
        };
        this.mostrarConductores = () => {
            console.log(this.conductores);
        };
        this.mostrarPedidos = () => {
            console.log(this.pedidos);
        };
    }
}
exports.Conductors = Conductors;
