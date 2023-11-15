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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conductores_models_1 = __importDefault(require("../models/conductores.models"));
const axios_1 = __importDefault(require("axios"));
const conductores_models_aux_1 = require("../models/conductores.models.aux");
const clases_models_aux_1 = require("../models/clases.models.aux");
class SocketsConfig {
    constructor(io) {
        // TODO: Nuevo
        this.conductoresNuevo = new conductores_models_aux_1.Conductors();
        // TODO: Antiguo
        this.conductores = new conductores_models_1.default();
        this.actualizarContador = (data) => {
            this.io.to(data.socketId).emit('actualizar contador', {
                contador: data.contador,
                isReset: data.isReset
            });
        };
        this.enviarSolicitud = (socket, payload) => {
            var cantidadDisponible = 0;
            const conductor = this.conductores.getConductorDistanciaCorta({ lat: payload.origen[0], lng: payload.origen[1] });
            this.conductores.updateStatus({
                clientId: payload.cliente_id,
                socketClientId: payload.socket_client_id,
                socketId: conductor.socketId,
                status: 'EN_ESPERA',
                pedidoId: payload.pedido_id
            });
            if (conductor.id === '') {
                console.log('para el cliente. No hay conductores disponibles');
                this.io.to(payload.socket_client_id).emit('respuesta solicitud usuario', {
                    'ok': false,
                    'msg': 'No hay conductores disponibles',
                });
            }
            else {
                console.log('Desde el cliente, solicitud enviada al conductor');
                this.io.to(conductor.socketId).emit('notificacion pedido conductor', {
                    'ok': true,
                    'msg': 'Hay un nuevo cliente',
                    payload
                });
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
                // TODO: agregar conductor
                this.conductoresNuevo.agregarNuevoConductor(new clases_models_aux_1.ConductorModel(payload.id, socket.id));
                // this.conductoresNuevo.mostrarConductores();
                // TODO: Antiguo
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
            socket.on('actualizar coordenadas conductor', (payload) => {
                var _a;
                // TODO: Antiguo
                this.conductores.updateLatLngBySocketId({
                    socketId: socket.id,
                    lat: payload.lat,
                    lng: payload.lng
                });
                const conductor = this.conductores.getConductorBySocketId(socket.id);
                if ((conductor === null || conductor === void 0 ? void 0 : conductor.status) === 'OCUPADO') {
                    if (conductor.cliente != null) {
                        this.io.to((_a = conductor.cliente) === null || _a === void 0 ? void 0 : _a.socketid).emit('actualizar posicion conductor', payload);
                    }
                }
                console.log('actualizar');
                this.conductores.mostrarConductores();
            });
            // ------------------------CONDUCTOR---------------------------------------
            socket.on('pedido proceso cancelado conductor', (payload) => {
                // TODO: Antiguo
                this.conductores.clearStatusBySocketId(socket.id);
                console.log(`pedido en proceso cancelado por el conductor ${socket.id}`);
                this.io.to(payload.socket_client_id).emit('pedido en proceso cancelado');
            });
            // ---------------------CONDUCTOR--------------------------------
            socket.on('finalizar viaje', (payload) => {
                // TODO: Nuevo
                var _a;
                // TODO: Antiguo
                const conductor = this.conductores.getConductorBySocketId(socket.id);
                if ((conductor === null || conductor === void 0 ? void 0 : conductor.status) === 'OCUPADO' && ((_a = conductor.cliente) === null || _a === void 0 ? void 0 : _a.id) === payload.cliente_id) {
                    // this.io.to(payload.cliente.)
                }
            });
            // ------------------------CONDUCTOR---------------------------------------
            socket.on('respuesta del conductor', (payload) => {
                console.log(`un conducto ${payload.pedido_aceptado} de este usuario`);
                if (payload.pedido_aceptado) {
                    // Obtener todos los conductores que tienen al cliente en espera, o esta ocupado
                    const conductores = this.conductores.getConductoresByClienteId(payload.socket_client_id);
                    // Primero verifica si hay un conductor que ya a tomado este pedido
                    // Esto lo hago, ya que la conexion a internet puede variar, y puede existir alguien que le dio el boton y todavia este procesando, entonces
                    // si el otro tiene mejor conexion para evitar un choque de dos conductores al mismo cliente, se notifica que este pedido ya a sido tomado por otro
                    // conductor
                    if (conductores.some((conductor) => conductor.status === 'OCUPADO')) {
                        socket.emit('pedido ya tomado');
                        return;
                    }
                    this.conductores.updateStatus({
                        clientId: payload.cliente_id,
                        socketClientId: payload.socket_client_id,
                        socketId: socket.id,
                        status: 'OCUPADO',
                        pedidoId: payload.pedido_id
                    });
                    const conductor = this.conductores.getConductorBySocketId(socket.id);
                    console.log(payload.socket_client_id);
                    this.io.to(payload.socket_client_id).emit('pedido aceptado por conductor', conductor);
                    // TODO: Emitir un mensaje a todos los conductores que estan en espera con este usuario, que este pedido ya a sido tomado
                    conductores.forEach((conductor) => {
                        if (conductor.status === 'EN_ESPERA' && conductor.socketId != socket.id) {
                            this.conductores.clearStatusBySocketId(conductor.socketId);
                            this.io.to(conductor.socketId).emit('pedido ya tomado');
                        }
                    });
                }
                else {
                    this.conductores.setStatusDisponible(socket.id);
                    this.actualizarContador({ socketId: payload.socket_client_id, contador: -1, isReset: false });
                }
            });
            // ---------------------CONDUCTOR------------------------------
            socket.on('ya estoy aqui', (payload) => {
                console.log('Ya estoy aqui');
                console.log(payload);
                this.io.to(payload.socket_client_id).emit('El conductor ya esta aqui');
            });
            // ---------------------CONDUCTOR-----------------------------
            socket.on('finalizar pedido', (payload) => {
                this.io.to(payload.socket_client_id).emit('pedido finalizado');
            });
            // ---------------------CLIENTE--------------------------------
            socket.on('solicitar', (payload) => __awaiter(this, void 0, void 0, function* () {
                const url = `${process.env.URL}/conductorDisponible.php`;
                const formData = new FormData();
                formData.append('btip', 'BUES');
                formData.append('bestado', 'ES');
                formData.append('bsubservicio', payload.servicio);
                const resp = yield axios_1.default.post(url, formData, {
                    headers: {}
                });
                // 'btip': 'BUES'
                console.log('Cantidad de conductores====================================');
                console.log(payload.servicio);
                console.log(resp.data);
                // el origen, destino, el [0] es la latitud y el [1] es la longitud
                console.log(`El cliente ${socket.id} esta solicitando un pedido de ${payload.servicio} en ${payload.origen} hasta el ${payload.destino}`);
                console.log(payload);
                payload.socket_client_id = socket.id;
                this.enviarSolicitud(socket, payload);
            }));
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
                // TODO: Nuevo
                this.conductoresNuevo.eliminarUsuarioById(socket.id);
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
