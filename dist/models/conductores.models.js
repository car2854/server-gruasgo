"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calculateDistance_1 = require("../middleware/calculateDistance");
const conductor_models_1 = __importDefault(require("./conductor.models"));
class Conductores {
    constructor() {
        this.conductores = [];
        this.getConductorDistanciaCorta = (data) => {
            var conductor = new conductor_models_1.default('', '', -1, -1, '', 'OCUPADO', null);
            var distancia = 9999999;
            this.conductores.forEach((dataConductores) => {
                if ((dataConductores.status === 'DISPONIBLE')) {
                    const dis = (0, calculateDistance_1.calculateDistance)({
                        lat1: data.lat,
                        lon1: data.lng,
                        lat2: dataConductores.lat,
                        lon2: dataConductores.lng
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
        this.setStatusDisponible = (socketId) => {
            if (this.existConductorBySocketId(socketId)) {
                this.conductores = this.conductores.map((conductor) => {
                    if (conductor.socketId === socketId) {
                        conductor.status = 'DISPONIBLE';
                        conductor.cliente = null;
                    }
                    ;
                    return conductor;
                });
            }
        };
    }
    existConductorById(id) {
        return this.conductores.some((resp) => resp.id === id);
    }
    existConductorBySocketId(socketId) {
        return this.conductores.some((resp) => resp.socketId === socketId);
    }
    getConductorBySocketId(socketId) {
        return this.conductores.find((conductor) => conductor.socketId = socketId);
    }
    addConductor(data) {
        if (!this.existConductorById(data.id)) {
            this.conductores.push(new conductor_models_1.default(data.id, data.idSocket, data.lat, data.lng, data.servicio, 'DISPONIBLE', null));
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
    clearStatusBySocketId(socketId) {
        if (this.existConductorBySocketId(socketId)) {
            this.conductores = this.conductores.map((conductor) => {
                if (conductor.socketId === socketId) {
                    conductor.status = 'DISPONIBLE';
                    conductor.cliente = null;
                }
                return conductor;
            });
        }
    }
    updateStatus(data) {
        if (this.existConductorBySocketId(data.socketId)) {
            this.conductores = this.conductores.map((dataConductor) => {
                if (dataConductor.socketId === data.socketId) {
                    dataConductor.status = data.status;
                    dataConductor.cliente = {
                        id: data.clientId,
                        socketid: data.socketClientId,
                        pedidoId: data.pedidoId
                    };
                }
                ;
                return dataConductor;
            });
        }
    }
    getConductoresByClienteId(client_id) {
        return this.conductores.filter((conductor) => { var _a; return ((_a = conductor.cliente) === null || _a === void 0 ? void 0 : _a.id) === client_id; }).map(_ => _);
    }
    removeConductorBySocketId(socketId) {
        if (this.existConductorBySocketId(socketId)) {
            this.conductores = this.conductores.filter((resp) => resp.socketId != socketId).map((_) => _);
        }
    }
    mostrarConductores() {
        console.log(this.conductores);
    }
}
exports.default = Conductores;
