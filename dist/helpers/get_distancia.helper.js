"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistanciaHelpers = void 0;
const getDistanciaHelpers = (lat1, lon1, lat2, lon2) => {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c;
    return distancia;
};
exports.getDistanciaHelpers = getDistanciaHelpers;
const toRadians = (grados) => {
    return grados * (Math.PI / 180);
};
