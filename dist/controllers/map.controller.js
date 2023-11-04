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
const axios_1 = __importDefault(require("axios"));
// import {Client} from "@googlemaps/google-maps-services-js";
class MapController {
    constructor() {
        this.searchPlaceByCoors = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { lat, lng } = req.query;
                if (lat === null || lng === null) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Debe enviar lat y lng en el query'
                    });
                }
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.API_KEY_GOOGLE_MAP}`;
                const resp = yield axios_1.default.get(url);
                const direccion = resp.data.results[0].formatted_address;
                const componentes = resp.data.results[0].address_components;
                var lugar = '';
                console.log('--------------------------------');
                console.log(componentes);
                componentes.forEach((componente) => {
                    if (componente.types.includes('route') || componente.types.includes('sublocality')) {
                        if (lugar.length === 0) {
                            lugar = componente.long_name;
                        }
                        else {
                            lugar = lugar + ' ' + componente.long_name;
                        }
                    }
                    // Puedes agregar más condiciones según tus necesidades, por ejemplo, para extraer el nombre del lugar
                });
                if (lugar.length === 0) {
                    lugar = 'Santa Cruz de la Sierra';
                }
                return res.json({
                    ok: true,
                    // place: resp.data['results'][0]['address_components']
                    place: lugar
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Check with the administrator'
                });
            }
        });
        this.searchPlace = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const place = (_a = req.query.place) !== null && _a !== void 0 ? _a : '';
                // let client = new Client({});
                // let data1 = await client.placeAutocomplete({
                //   params: {
                //     location: { lat: -17.7867406, lng: -63.1828296},
                //     radius: 31000,
                //     key: process.env.API_KEY_GOOGLE_MAP!,
                //     input: "",
                //     language: "es",
                //     components: ['BO']
                //   },
                //   timeout: 1000
                // });
                // console.log('-----------------');
                // console.log(data1);
                // console.log('-----------------');
                // const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&region=BO&location=-17.7867406,-63.1828296&radius=31000&key=${process.env.API_KEY_GOOGLE_MAP}&limit=5`;
                const API_KEY = process.env.API_KEY_GOOGLE_MAP;
                const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
                // const resp = await axios.get(url);
                const resp = yield axios_1.default.get(baseUrl, {
                    params: {
                        location: '-17.7867406,-63.1828296',
                        radius: 31000,
                        key: API_KEY,
                        keyword: place,
                        language: 'es'
                    }
                });
                const list = [{}];
                resp.data['results'].forEach((element) => {
                    if (list.length === 6)
                        return;
                    if (element) {
                        list.push({
                            name: element['name'],
                            position: element['geometry']['location']
                        });
                    }
                });
                return res.json({
                    ok: true,
                    places: list
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Check with the administrator'
                });
            }
        });
        this.calculatePrice = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { lat_origen, lng_origen, lat_destino, lng_destino, servicio } = req.body;
                const resp = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${lat_destino},${lng_destino}&origins=${lat_origen},${lng_origen}&key=${process.env.API_KEY_GOOGLE_MAP}`);
                const text = resp.data.rows[0].elements[0].distance.text;
                const distancia = text.substring(0, text.length - 3);
                // const respCost = await axios.post(`https://nesasbolivia.com/gruasgo/pedido.php`, {
                //   'btip': 'costo',
                //   'bkilometros': '2.0',
                //   'bserv': 'gruas'
                // });
                // console.log(respCost.data);
                return res.json({
                    ok: true,
                    distancia
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Check with the administrator'
                });
            }
        });
    }
}
exports.default = MapController;
