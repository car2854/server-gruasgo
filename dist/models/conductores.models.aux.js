"use strict";
// import {d } from "./clases.models.aux";
// export class Conductors{
//   public conductores: ConductorModel[] = [];
//   public pedidos: PedidoModel[] = [];
//   private getConductorById = (id: string) => this.conductores.find((conductor: ConductorModel) => conductor.id === id);
//   private getPedidoByIdPedido = (idPedido: string) => this.pedidos.find((pedido: PedidoModel) => pedido.idPedido === idPedido);
//   public eliminarUsuarioById = (socket: string) => {
//     this.conductores = this.conductores.filter((usuario: ConductorModel) => usuario.socket != socket).map((_) => _);
//   }
//   public agregarNuevoConductor = (conductor: ConductorModel) => {
//     if (this.getConductorById(conductor.id) == null){
//       const existe = this.pedidos.some((pedido: PedidoModel) => pedido.idConductorAceptado === conductor.id);
//       this.conductores.push(conductor);
//     }
//   }
//   public agregarPedido = (pedido: PedidoModel) => {
//     if (!this.getPedidoByIdPedido(pedido.idPedido) == null){
//       this.pedidos.push(pedido);
//     }
//   }
//   public actualizarSocketPedido = (data: {id: string, nuevoSocket: string}) => {
//     const pedido = this.getPedidoByIdPedido(data.id);
//     if (pedido){
//       pedido.socket = data.nuevoSocket;
//     }
//   }
//   public actualizarSocketConductor = (data: {id: string, nuevoSocket: string}) => {
//     const conductor = this.getConductorById(data.id);
//     if (conductor){
//       conductor.socket = data.nuevoSocket;
//     }
//   }
//   public pedidoRechazado = (data: {idConductor: string, idPedido: string}) => {
//     const pedido = this.getPedidoByIdPedido(data.idPedido);
//     if (pedido){
//       pedido.idConductoresRechazados.push(data.idConductor);
//     }
//   }
//   public pedidoAceptado = (data: {idConductor: string, idPedido: string}) => {
//     const pedido = this.getPedidoByIdPedido(data.idPedido);
//     if (pedido){
//       pedido.idConductorAceptado = data.idConductor;
//     }
//   }
//   public eliminarPedido = (idPedido: string) => {
//     const pedido = this.getPedidoByIdPedido(idPedido);
//     if (pedido) {
//       this.pedidos = this.pedidos.filter((data) => data !== pedido);
//     }
//   }
//   public mostrarConductores = () => {
//     console.log(this.conductores);
//   }
//   public mostrarPedidos = () => {
//     console.log(this.pedidos);
//   }
// }
