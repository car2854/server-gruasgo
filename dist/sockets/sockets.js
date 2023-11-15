"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const clases_models_aux_1 = require("../models/clases.models.aux");
const http_services_1 = require("../services/http.services");
const get_id_conductor_cercano_1 = require("../helpers/get_id_conductor_cercano");
const get_conductor_no_rechazado_helper_1 = require("../helpers/get_conductor_no_rechazado.helper");
class SocketsConfig {
    constructor(io) {
        this.usuarios = [];
        this.pedidos = [];
        // usuario
        this.getUsuarioById = (id) => this.usuarios.find((usuario) => usuario.id === id);
        this.getUsuarioBySocket = (socket) => this.usuarios.find((usuario) => usuario.socket === socket);
        this.eliminarUsuarioBySocket = (socket) => {
            this.usuarios = this.usuarios.filter(usuario => usuario.socket != socket).map(_ => _);
        };
        this.agregarNuevoUsuario = (nuevoUsuario) => {
            const usuario = this.getUsuarioById(nuevoUsuario.id);
            if (usuario == null)
                this.usuarios.push(nuevoUsuario);
        };
        // Pedido
        this.getPedidoByIdPedido = (idPedido) => this.pedidos.find((pedido) => pedido.idPedido === idPedido);
        this.getPedidoByIdCliente = (idCliente) => this.pedidos.find((pedido) => pedido.idCliente === idCliente);
        this.agregarNuevoPedido = (nuevoPedido) => {
            const pedido = this.getPedidoByIdPedido(nuevoPedido.idPedido);
            if (pedido == null)
                this.pedidos.push(nuevoPedido);
        };
        this.eliminarPedidoByIdPedido = (idPedido) => {
            this.pedidos = this.pedidos.filter(pedido => pedido.idPedido != idPedido).map(_ => _);
        };
        this.nuevoRechazoPedido = (idConductor, idPedido) => {
            const pedido = this.getPedidoByIdPedido(idPedido);
            const existe = pedido === null || pedido === void 0 ? void 0 : pedido.idConductoresRechazados.some((data) => data === idConductor);
            if (!existe) {
                pedido === null || pedido === void 0 ? void 0 : pedido.idConductoresRechazados.push(idConductor);
            }
        };
        this.io = io;
        this.connection();
    }
    connection() {
        this.io.on('connection', (socket) => {
            console.log(`El cliente ${socket.id} se ha conectado`);
            // -----------------------CONDUCTOR--------------------------------------------
            socket.on('usuario online', (payload) => __awaiter(this, void 0, void 0, function* () {
                this.agregarNuevoUsuario(new clases_models_aux_1.UsuarioModel(payload.id, socket.id));
                console.log('usuarios online');
                this.usuarios.forEach(element => {
                    console.log(element);
                });
                console.log(payload.servicio);
                if (payload.servicio != null) {
                    const status = yield (0, http_services_1.actualizarBanderaConductor)({
                        bandera: '0',
                        estado: 'ES',
                        servicio: payload.servicio,
                        idConductor: payload.id
                    });
                    console.log('Ver la bandera');
                    console.log(status.data);
                }
            }));
            // --------------------------CONDUCTOR-----------------------------------
            socket.on('actualizar coordenadas conductor', (payload) => {
                const pedido = this.getPedidoByIdPedido(payload.idPedido);
                if (pedido) {
                    const cliente = this.getUsuarioById(pedido.idCliente);
                    console.log('enviando las nuevas coordenadas al cliente');
                    if (cliente) {
                        this.io.to(cliente.socket).emit('actualizar posicion conductor', payload);
                    }
                    else {
                        console.log('El cliente esta desconectado');
                    }
                }
            });
            // ------------------------CONDUCTOR---------------------------------------
            socket.on('pedido proceso cancelado conductor', (payload) => {
                const cliente = this.getUsuarioById(payload.idCliente);
                if (cliente) {
                    this.io.to(cliente.socket).emit('pedido en proceso cancelado');
                }
                else {
                    console.log('El cliente esta desconectado');
                }
            });
            // ------------------------CONDUCTOR---------------------------------------
            socket.on('respuesta del conductor', (payload) => __awaiter(this, void 0, void 0, function* () {
                // console.log(`un conducto ${payload.pedido_aceptado} de este usuario`);
                const pedido = this.getPedidoByIdPedido(payload.idPedido);
                if (!pedido)
                    return;
                // Acepta el pedido
                if (payload.pedidoAceptado) {
                    const pedido = this.getPedidoByIdPedido(payload.idPedido);
                    const usuario = this.getUsuarioById(pedido.idCliente);
                    const conductor = this.getUsuarioBySocket(socket.id);
                    const status = yield (0, http_services_1.actualizarBanderaConductor)({
                        bandera: '0',
                        estado: 'ES',
                        servicio: payload.servicio,
                        idConductor: conductor.id
                    });
                    console.log('Respuesta despues de la bandera');
                    console.log(status.data);
                    this.io.to(usuario.socket).emit('pedido aceptado por conductor', { id: conductor === null || conductor === void 0 ? void 0 : conductor.id, lat: payload.lat, lng: payload.lng });
                }
                else {
                    // Rechaza el pedido
                    const conductorData = this.getUsuarioBySocket(socket.id);
                    const status = yield (0, http_services_1.actualizarBanderaConductor)({
                        bandera: '0',
                        estado: 'ES',
                        servicio: payload.servicio,
                        idConductor: conductorData.id
                    });
                    console.log('ver bandera');
                    console.log(status.data);
                    this.nuevoRechazoPedido(conductorData.id, payload.idPedido);
                    const resp = yield (0, http_services_1.getConductoresDisponibles)(payload.servicio);
                    const conductor = (0, get_conductor_no_rechazado_helper_1.getConductorNoRechazado)(resp.data, this.usuarios, pedido, payload.origen, payload.destino);
                    if (conductor != null) {
                        if (conductor) {
                            this.io.to(conductor.socket).emit('notificacion pedido conductor', {
                                'ok': true,
                                'msg': 'Hay un nuevo cliente',
                                payload
                            });
                        }
                    }
                    else {
                        this.eliminarPedidoByIdPedido(payload.idPedido);
                        console.log('Pedidos restante');
                        this.pedidos.forEach(element => {
                            console.log(element);
                        });
                        socket.emit('respuesta solicitud usuario', {
                            'ok': false,
                            'msg': 'No hay conductores disponibles',
                        });
                    }
                }
            }));
            // ---------------------CONDUCTOR------------------------------
            socket.on('ya estoy aqui', (payload) => {
                const cliente = this.getUsuarioById(payload.idCliente);
                if (cliente) {
                    this.io.to(cliente.socket).emit('El conductor ya esta aqui');
                }
                else {
                    console.log('El cliente esta desconectado');
                }
            });
            // ---------------------CONDUCTOR-----------------------------
            socket.on('finalizar pedido', (payload) => {
                const cliente = this.getUsuarioById(payload.idCliente);
                if (cliente) {
                    this.io.to(cliente.socket).emit('pedido finalizado');
                }
                else {
                    console.log('El cliente esta desconectado');
                }
            });
            // ---------------------CLIENTE--------------------------------
            socket.on('solicitar', (payload) => __awaiter(this, void 0, void 0, function* () {
                const resp = yield (0, http_services_1.getConductoresDisponibles)(payload.servicio);
                const conductoresDb = resp.data;
                let idConductor = (0, get_id_conductor_cercano_1.getIdConductorCercano)(conductoresDb, payload.origen, payload.destino);
                if (idConductor != '') {
                    // Agregar nuevo pedido
                    this.agregarNuevoPedido(new clases_models_aux_1.PedidoModel(payload.idPedido, payload.idCliente, null, idConductor, []));
                    console.log('pedidos');
                    this.pedidos.forEach(element => {
                        console.log(element);
                    });
                    const status = yield (0, http_services_1.actualizarBanderaConductor)({
                        bandera: '1',
                        estado: 'ES',
                        servicio: payload.servicio,
                        idConductor: idConductor
                    });
                    console.log('ver bandera');
                    console.log(status.data);
                    const usuario = this.getUsuarioById(idConductor);
                    if (usuario) {
                        this.io.to(usuario.socket).emit('notificacion pedido conductor', {
                            'ok': true,
                            'msg': 'Hay un nuevo cliente',
                            payload
                        });
                    }
                }
                else {
                    socket.emit('respuesta solicitud usuario', {
                        'ok': false,
                        'msg': 'No hay conductores disponibles',
                    });
                }
            }));
            // -----------------------------CLIENTE------------------------------
            socket.on('cancelar pedido cliente', (payload) => {
                const pedido = this.getPedidoByIdPedido(payload.idPedido);
                if (pedido && pedido.idConductorSolicitud != null) {
                    const conductor = this.getUsuarioById(pedido.idConductorSolicitud);
                    if (conductor) {
                        this.io.to(conductor.socket).emit('pedido cancelado desde cliente');
                    }
                }
                this.eliminarPedidoByIdPedido(payload.idPedido);
            });
            // -------------------------------------------------------------------
            socket.on('disconnect', () => {
                const usuario = this.getUsuarioBySocket(socket.id);
                if (usuario) {
                    const pedido = this.getPedidoByIdCliente(usuario.id);
                    if (pedido) {
                        if (!pedido.idConductorAceptado) {
                            if (pedido.idConductorSolicitud != null) {
                                const conductor = this.getUsuarioById(pedido.idConductorSolicitud);
                                if (conductor) {
                                    this.io.to(conductor.socket).emit('pedido cancelado desde cliente');
                                }
                            }
                            this.eliminarPedidoByIdPedido(pedido.idPedido);
                        }
                    }
                }
                this.eliminarUsuarioBySocket(socket.id);
                console.log('un usuario desconectado');
                this.usuarios.forEach(element => {
                    console.log(element);
                });
            });
        });
    }
}
exports.default = SocketsConfig;
