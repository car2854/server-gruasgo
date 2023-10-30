"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSolicitarConductores = void 0;
const handleSolicitarConductores = (socket, conductores, io) => {
    socket.on('solicitar', (payload) => {
        // el origen, destino, el [0] es la latitud y el [1] es la longitud
        console.log(`El usuario ${socket.id} esta solicitando un pedido de ${payload.servicio} en ${payload.origen} hasta el ${payload.destino}`);
        payload.socket_client_id = socket.id;
        handleClienteEnviarSolicitud(socket, payload, conductores, io);
    });
};
exports.handleSolicitarConductores = handleSolicitarConductores;
const handleClienteEnviarSolicitud = (socket, payload, conductores, io) => {
    var _a;
    const max_driver = parseInt((_a = process.env.MAX_DRIVER) !== null && _a !== void 0 ? _a : '5');
    for (let i = 0; i < max_driver; i++) {
        const conductor = conductores.getConductorDistanciaCorta({ lat: payload.origen[0], lng: payload.origen[1], socketClienteId: payload.socket_client_id });
        conductores.updateStatus({
            clientId: payload.cliente_id,
            socketClientId: payload.socket_client_id,
            socketId: conductor.socketId,
            status: 'EN_ESPERA'
        });
        if (i === 0 && conductor.id === '') {
            console.log('para el cliente. No hay conductores disponibles');
            io.to(payload.socket_client_id).emit('respuesta solicitud usuario', {
                'ok': false,
                'msg': 'No hay conductores disponibles',
            });
        }
        else if (conductor.id != '') {
            console.log('Desde el cliente, solicitud enviada al conductor');
            io.to(conductor.socketId).emit('solicitud pedido conductor', {
                'ok': true,
                'msg': 'Hay un nuevo cliente',
                payload
            });
            // this.actualizarContador(socket, +1);
        }
        else {
            break;
        }
    }
};
