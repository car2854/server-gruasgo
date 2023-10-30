"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conductores_models_1 = __importDefault(require("../models/conductores.models"));
class SocketsConfig {
    constructor(io) {
        this.conductores = new conductores_models_1.default();
        this.actualizarContador = (data) => {
            this.io.to(data.socketId).emit('actualizar contador', {
                contador: data.contador,
                isReset: data.isReset
            });
        };
        this.enviarSolicitud = (socket, payload) => {
            var _a;
            const maxDriver = parseInt((_a = process.env.MAX_DRIVER) !== null && _a !== void 0 ? _a : '5');
            var cantidadDisponible = 0;
            for (let i = 0; i < maxDriver; i++) {
                const conductor = this.conductores.getConductorDistanciaCorta({ lat: payload.origen[0], lng: payload.origen[1] });
                this.conductores.updateStatus({
                    clientId: payload.cliente_id,
                    socketClientId: payload.socket_client_id,
                    socketId: conductor.socketId,
                    status: 'EN_ESPERA'
                });
                if (i === 0 && conductor.id === '') {
                    console.log('para el cliente. No hay conductores disponibles');
                    this.io.to(payload.socket_client_id).emit('respuesta solicitud usuario', {
                        'ok': false,
                        'msg': 'No hay conductores disponibles',
                    });
                }
                else if (conductor.id != '') {
                    cantidadDisponible = cantidadDisponible + 1;
                    console.log('Desde el cliente, solicitud enviada al conductor');
                    this.io.to(conductor.socketId).emit('solicitud pedido conductor', {
                        'ok': true,
                        'msg': 'Hay un nuevo cliente',
                        payload
                    });
                }
                else {
                    break;
                }
            }
            this.actualizarContador({ socketId: socket.id, contador: cantidadDisponible, isReset: true });
        };
        this.io = io;
        this.connection();
    }
    connection() {
        this.io.on('connection', (socket) => {
            console.log(`El cliente ${socket.id} se ha conectado`);
            // -----------------------CONDUCTOR--------------------------------------------
            socket.on('conductor online', (payload) => {
                this.conductores.addConductor({
                    id: payload.id,
                    idSocket: socket.id,
                    lat: payload.lat,
                    lng: payload.lng,
                    servicio: payload.servicio
                });
                console.log('conectar');
                this.conductores.mostrarConductores();
            });
            // --------------------------CONDUCTOR-----------------------------------
            socket.on('actualizar', (payload) => {
                this.conductores.updateLatLngBySocketId({
                    socketId: socket.id,
                    lat: payload.lat,
                    lng: payload.lng
                });
                console.log('actualizar');
                this.conductores.mostrarConductores();
            });
            // ------------------------CONDUCTOR---------------------------------------
            socket.on('respuesta del conductor', (payload) => {
                console.log(`un conducto ${payload.pedido_aceptado} de este usuario`);
                if (payload.pedido_aceptado) {
                    this.conductores.updateStatus({
                        clientId: payload.cliente_id,
                        socketClientId: payload.socket_client_id,
                        socketId: socket.id,
                        status: 'OCUPADO'
                    });
                    const conductor = this.conductores.getConductorBySocketId(socket.id);
                    console.log(payload.socket_client_id);
                    this.io.to(payload.socket_client_id).emit('pedido aceptado por conductor', conductor);
                    // TODO: Emitir un mensaje a todos los conductores que estan en espera con este usuario, que este pedido ya a sido tomado
                }
                else {
                    this.conductores.setStatusDisponible(socket.id);
                    this.actualizarContador({ socketId: payload.socket_client_id, contador: -1, isReset: false });
                }
            });
            // --------------------------CONDUCTOR----------------------------------
            // socket.on('aceptar pedido', (payload: {socket_client_id:string, client_id: string}) => {
            //   this.conductores.updateStatus({socketId: socket.id, socketClientId: payload.socket_client_id, clientId: payload.client_id, status: 'OCUPADO'});
            //   console.log(`El conductor ${socket.id} ha aceptado el pedido del cliente ${payload.socket_client_id}`);
            //   this.io.to(payload.socket_client_id).emit('pedido aceptado', {
            //     // informacion del conductor
            //   });
            // });
            // ---------------------CLIENTE--------------------------------
            socket.on('solicitar', (payload) => {
                // el origen, destino, el [0] es la latitud y el [1] es la longitud
                console.log(`El cliente ${socket.id} esta solicitando un pedido de ${payload.servicio} en ${payload.origen} hasta el ${payload.destino}`);
                payload.socket_client_id = socket.id;
                this.enviarSolicitud(socket, payload);
            });
            // -----------------------------CLIENTE------------------------------
            socket.on('cancelar pedido cliente', (payload) => {
                console.log(`El cliente ${socket.id} ha cancelado el pedido`);
                const conductores = this.conductores.getConductoresByClienteId(payload.cliente_id);
                conductores.forEach(conductor => {
                    this.solicitudCancelada(conductor.socketId);
                    this.conductores.setStatusDisponible(conductor.socketId);
                });
            });
            // -------------------------------------------------------------------
            socket.on('disconnect', () => {
                console.log(`El cliente ${socket.id} se ha desconectado`);
                this.conductores.removeConductorBySocketId(socket.id);
                console.log('desconectar');
                this.conductores.mostrarConductores();
            });
        });
    }
    solicitudCancelada(socketId) {
        this.io.to(socketId).emit('solicitud cancelada', {});
    }
}
exports.default = SocketsConfig;
