"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateDistance_1 = require("../middleware/calculateDistance");
class ConductorModels {
    constructor(id, socketId, lat, lng, servicio, status, cancel, clienteId) {
        this.id = id;
        this.socketId = socketId;
        this.lat = lat;
        this.lng = lng;
        this.servicio = servicio;
        this.status = status;
        this.cancel = cancel;
        this.clienteId = clienteId;
    }
}
class Conductores {
    constructor() {
        this.conductores = [];
        this.getConductorDistanciaCorta = (data) => {
            var conductor = new ConductorModels('', '', '', '', '', 'BUSY', []);
            var distancia = 9999999;
            this.conductores.forEach((dataConductores) => {
                if ((dataConductores.status === 'AVAILABLE') && (data.socketClienteId != null && !dataConductores.cancel.some((dataSome) => dataSome === data.socketClienteId))) {
                    const dis = (0, calculateDistance_1.calculateDistance)({
                        lat1: data.lat,
                        lon1: data.lng,
                        lat2: parseFloat(dataConductores.lat),
                        lon2: parseFloat(dataConductores.lng)
                    });
                    if (dis < distancia) {
                        distancia = dis;
                        conductor = dataConductores;
                    }
                    ;
                }
            });
            return conductor;
        };
    }
    existConductorById(id) {
        return this.conductores.some((resp) => resp.id === id);
    }
    existConductorBySocketId(socketId) {
        return this.conductores.some((resp) => resp.socketId === socketId);
    }
    addConductor(data) {
        if (!this.existConductorById(data.id)) {
            this.conductores.push(new ConductorModels(data.id, data.idSocket, data.lat, data.lng, data.servicio, 'AVAILABLE', []));
        }
    }
    removeConductor(id) {
        if (this.existConductorById(id)) {
            this.conductores = this.conductores.filter((resp) => resp.id != id).map((_) => _);
        }
    }
    updateLatLngBySocketId(data) {
        if (this.existConductorBySocketId(data.socketId)) {
            this.conductores = this.conductores.map((dataConductores) => {
                if (dataConductores.socketId === data.socketId) {
                    dataConductores.lat = data.lat;
                    dataConductores.lng = data.lng;
                }
                return dataConductores;
            });
        }
    }
    updateStatusBusy(data) {
        if (this.existConductorBySocketId(data.socketId)) {
            this.conductores = this.conductores.map((dataConductor) => {
                if (dataConductor.socketId === data.socketId) {
                    dataConductor.status = 'BUSY';
                    dataConductor.clienteId = data.socketClientId;
                }
                ;
                return dataConductor;
            });
        }
    }
    removeConductorBySocketId(socketId) {
        if (this.existConductorBySocketId(socketId)) {
            this.conductores = this.conductores.filter((resp) => resp.socketId != socketId).map((_) => _);
        }
    }
    nuevaCancelacion(socketId, socketClienteId) {
        if (this.existConductorBySocketId(socketId)) {
            this.conductores = this.conductores.map((conductor) => {
                if (conductor.socketId === socketId)
                    conductor.cancel.push(socketClienteId);
                return conductor;
            });
        }
    }
    mostrarConductores() {
        console.log(this.conductores);
    }
}
exports.default = Conductores;
