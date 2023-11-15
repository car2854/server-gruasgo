"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdConductorCercano = void 0;
const get_distancia_helper_1 = require("./get_distancia.helper");
const getIdConductorCercano = (conductores, origen, destino) => {
    let distanciaCorta = 999999999999;
    let idConductor = '';
    conductores.forEach((data) => {
        const distancia = (0, get_distancia_helper_1.getDistanciaHelpers)(origen[0], destino[0], origen[1], destino[1]);
        if (distancia < distanciaCorta) {
            distanciaCorta = distancia;
            idConductor = data.idConductor;
        }
    });
    return idConductor;
};
exports.getIdConductorCercano = getIdConductorCercano;
