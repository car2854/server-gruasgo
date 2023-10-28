"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const map_controller_1 = __importDefault(require("../controllers/map.controller"));
const express_validator_1 = require("express-validator");
const validators_middleware_1 = require("../middleware/validators.middleware");
const routerMap = (0, express_1.default)();
const mapController = new map_controller_1.default();
routerMap.post('/', [
    (0, express_validator_1.body)('lat_origen').notEmpty().isNumeric(),
    (0, express_validator_1.body)('lng_origen').notEmpty().isNumeric(),
    (0, express_validator_1.body)('lat_destino').notEmpty().isNumeric(),
    (0, express_validator_1.body)('lng_destino').notEmpty().isNumeric(),
    (0, express_validator_1.body)('servicio').notEmpty(),
    validators_middleware_1.validators
], mapController.calculatePrice);
routerMap.get('/search', mapController.searchPlace);
routerMap.get('/searchPlaceByCoors', mapController.searchPlaceByCoors);
exports.default = routerMap;
