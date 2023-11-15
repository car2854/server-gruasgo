"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConductorNoRechazado = void 0;
const get_id_conductor_cercano_1 = require("./get_id_conductor_cercano");
// Obtener los conductores que no rechazo el pedido, usando recursividad
const getConductorNoRechazado = (conductoresDb, usuarios, pedido, origen, destino) => {
    if (conductoresDb.length === 0)
        return null;
    let idConductor = (0, get_id_conductor_cercano_1.getIdConductorCercano)(conductoresDb, origen, destino);
    const conductor = usuarios.find((element) => element.id === idConductor);
    if (conductor) {
        const fueRechazado = pedido.idConductoresRechazados.some(element => element === conductor.id);
        if (fueRechazado) {
            conductoresDb = conductoresDb.filter((data) => data.idConductor != idConductor).map(_ => _);
            return (0, exports.getConductorNoRechazado)(conductoresDb, usuarios, pedido, origen, destino);
        }
    }
    return conductor !== null && conductor !== void 0 ? conductor : null;
};
exports.getConductorNoRechazado = getConductorNoRechazado;
