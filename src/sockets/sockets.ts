import { Server, Socket } from 'socket.io';
import ConductorInterface from '../interface/conductor.interface';
import Conductores from '../models/conductor.models';

interface DetallePedido {
  origen: any, 
  destino: any, 
  servicio: string,
  cliente: string,
  cliente_id: string,
  nombre_origen: string,
  nombre_destino: string,
  descripcion_descarga: string,
  referencia: number,
  monto: number,
  socket_client_id: string
}

class SocketsConfig {

  private conductores = new Conductores();

  private io: Server;

  constructor(io: Server){
    this.io = io;

    this.connection();
  }

  private connection(){

    this.io.on('connection', (socket: Socket) => {
      console.log(`El cliente ${socket.id} se ha conectado`);
      
      // -------------------------------------------------------------------
      socket.on('conductor online', (payload: ConductorInterface) => {
    
        this.conductores.addConductor({
            id: payload.id,
            idSocket: socket.id,
            lat: payload.lat,
            lng: payload.lng,
            servicio: payload.servicio
          });
        
        console.log('conectar');
        
        this.conductores.mostrarConductores();
      });

      // -------------------------------------------------------------------
      socket.on('actualizar', (payload: {lat: string, lng: string}) => {

        this.conductores.updateLatLngBySocketId({
          socketId: socket.id,
          lat: payload.lat,
          lng: payload.lng
        });
        
        console.log('actualizar');
        this.conductores.mostrarConductores();

      });

      // -------------------------------------------------------------------
      socket.on('solicitar', (payload: DetallePedido) => {

        // el origen, destino, el [0] es la latitud y el [1] es la longitud
        console.log(`El usuario ${socket.id} esta solicitando un pedido de ${payload.servicio} en ${payload.origen} hasta el ${payload.destino}`);
        
        payload.socket_client_id = socket.id;
        this.enviarSolicitud(socket, payload);
     
      });
      
      // -------------------------------------------------------------------
      socket.on('cancelar pedido', (payload: DetallePedido) => {

        // el origen, destino, el [0] es la latitud y el [1] es la longitud
        console.log(`El conductor ${socket.id} no ha aceptado el pedido, buscando otro conductor`);

        this.conductores.nuevaCancelacion(socket.id, payload.socket_client_id);
        this.enviarSolicitud(socket, payload);

      });

      // -------------------------------------------------------------------
      socket.on('aceptar pedido', (payload: {socket_client_id:string}) => {

        this.conductores.updateStatusBusy({socketId: socket.id, socketClientId: payload.socket_client_id});
        console.log(`El conductor ${socket.id} ha aceptado el pedido del cliente ${payload.socket_client_id}`);
        
        this.io.to(payload.socket_client_id).emit('pedido aceptado', {
          // informacion del conductor
        });

      });

      // -------------------------------------------------------------------
      socket.on('disconnect', () => {
        
        console.log(`El cliente ${socket.id} se ha desconectado`);
        this.conductores.removeConductorBySocketId(socket.id)
        console.log('desconectar');
        this.conductores.mostrarConductores();

      });
    });

  }



  private enviarSolicitud = (socket: Socket, payload: DetallePedido) => {


    const conductor = this.conductores.getConductorDistanciaCorta({lat: payload.origen[0], lng: payload.origen[1], socketClienteId: payload.socket_client_id});
  
    if (conductor.id === ''){
      console.log('para el cliente. No hay conductores disponibles');
      
      this.io.to(payload.socket_client_id).emit('respuesta solicitud usuario', {
        'ok': false,
        'msg' : 'No hay conductores disponibles',
      });
    }else{
  
      console.log('Desde el cliente, solicitud enviada al conductor');
      this.io.to(conductor.socketId).emit('solicitud pedido conductor', {
        'ok': true,
        'msg': 'Hay un nuevo cliente',
        payload
      });
    
    }
  
  }

}



export default SocketsConfig;