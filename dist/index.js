"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverconnection_1 = __importDefault(require("./connection/serverconnection"));
require('dotenv').config();
const main = () => {
    const server = new serverconnection_1.default();
    server.connection();
};
main();
