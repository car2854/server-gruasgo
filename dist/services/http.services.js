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
exports.updateEstadoPedidoCACL = exports.getPedido = exports.actualizarBanderaConductor = exports.getConductoresDisponibles = void 0;
const axios_1 = __importDefault(require("axios"));
const getConductoresDisponibles = (servicio) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${process.env.URL}/conductorDisponible.php`;
    const formData = new FormData();
    formData.append('btip', 'BUES');
    formData.append('bestado', 'ES');
    formData.append('bsubservicio', servicio);
    const resp = yield axios_1.default.post(url, formData);
    return resp;
});
exports.getConductoresDisponibles = getConductoresDisponibles;
const actualizarBanderaConductor = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${process.env.URL}/conductorDisponible.php`;
    const formData = new FormData();
    formData.append('btip', 'updBandera');
    formData.append('bbandera', data.bandera);
    formData.append('bestado', data.estado);
    formData.append('bsubservicio', data.servicio);
    formData.append('bidconductor', data.idConductor);
    const resp = yield axios_1.default.post(url, formData);
    return resp;
});
exports.actualizarBanderaConductor = actualizarBanderaConductor;
const getPedido = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${process.env.URL}/pedido.php`;
    const formData = new FormData();
    formData.append('btip', 'devPedido');
    formData.append('bidpedido', data.idPedido);
    const resp = yield axios_1.default.post(url, formData);
    return resp;
});
exports.getPedido = getPedido;
const updateEstadoPedidoCACL = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${process.env.URL}/pedido.php`;
    const formData = new FormData();
    formData.append('btip', 'updEstado');
    formData.append('bidpedido', data.idPedido);
    formData.append('bestado', "CACL");
    const resp = yield axios_1.default.post(url, formData);
    return resp;
});
exports.updateEstadoPedidoCACL = updateEstadoPedidoCACL;
