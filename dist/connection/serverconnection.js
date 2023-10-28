"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const map_router_1 = __importDefault(require("../routers/map.router"));
const sockets_1 = __importDefault(require("../sockets/sockets"));
class ServerConnection {
    constructor() {
        this.router = () => {
            this.app.use('/api/map', map_router_1.default);
        };
        this.middleware = () => {
            this.app.use(express_1.default.json());
        };
        this.connection = () => {
            var _a;
            console.log(process.env.PORT);
            this.server.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000, () => {
                var _a;
                console.log(`Servidor corriendo en el puerto: ${(_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000}`);
            });
        };
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server);
        this.socket = new sockets_1.default(this.io);
        this.middleware();
        this.router();
    }
}
exports.default = ServerConnection;
