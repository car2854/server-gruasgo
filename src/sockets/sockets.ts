import { Server, Socket } from 'socket.io';
import ConductorInterface from '../interface/conductor.interface';
import Conductores from '../models/conductores.models';
import { DetallePedido } from '../interface/detalle_pedido.interface';
import ConductorModels from '../models/conductor.models';
import axios from 'axios';
import { Conductors } from '../models/conductores.models.aux';

class SocketsConfig {

  // TODO: Nuevo
  private conductoresNuevo = new Conductors();

  // TODO: Antiguo
  private conductores = new Conductores();

  private io: Server;

  constructor(io: Server){
    this.io = io;

    this.connection();
  }

  private connection(){

    this.io.on('connection', (socket: Socket) => {
      console.log(`El cliente ${socket.id} se ha conectado`);
      
      // -----------------------CONDUCTOR--------------------------------------------
      socket.on('conductor online', (payload: ConductorInterface) => {

        // TODO: Nuevo
        this.conductoresNuevo.agregarNuevoConductor(
          {
            id: payload.id,
            socket: socket.id,
            lat: payload.lat,
            lng: payload.lng,
            servicio: payload.servicio,
            estado: 'libre'
          }
        );
        // this.conductoresNuevo.mostrarConductores();

        // TODO: Antiguo
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

      // --------------------------CONDUCTOR-----------------------------------
      socket.on('actualizar coordenadas conductor', (payload: {lat: number, lng: number}) => {

        // TODO: Nuevo, falta enviar el id en el socket
        // this.conductoresNuevo.actualizarCoordenadas({
        //   idConductor: 
        //   lat: payload.lat,
        //   lng: payload.lng
        // })


        // TODO: Antiguo
        this.conductores.updateLatLngBySocketId({
          socketId: socket.id,
          lat: payload.lat,
          lng: payload.lng
        });
        
        const conductor = this.conductores.getConductorBySocketId(socket.id);

        if (conductor?.status === 'OCUPADO'){

          if (conductor.cliente != null){
            this.io.to(conductor.cliente?.socketid).emit('actualizar posicion conductor', payload);
          }

        }
        console.log('actualizar');
        this.conductores.mostrarConductores();

      });
      
      // ------------------------CONDUCTOR---------------------------------------

      socket.on('pedido proceso cancelado conductor', (payload: DetallePedido) => {

        // TODO: Nuevo


        // TODO: Antiguo
        this.conductores.clearStatusBySocketId(socket.id);
        console.log(`pedido en proceso cancelado por el conductor ${socket.id}`);
        
        this.io.to(payload.socket_client_id).emit('pedido en proceso cancelado');

      });

      
      // ---------------------CONDUCTOR--------------------------------
      socket.on('finalizar viaje', (payload: DetallePedido) => {
        
        // TODO: Nuevo

        // TODO: Antiguo
        const conductor = this.conductores.getConductorBySocketId(socket.id);

        if (conductor?.status === 'OCUPADO' && conductor.cliente?.id === payload.cliente_id){

          // this.io.to(payload.cliente.)

        }

      });

      // ------------------------CONDUCTOR---------------------------------------
      socket.on('respuesta del conductor', (payload: DetallePedido) => {
        
        console.log(`un conducto ${payload.pedido_aceptado} de este usuario`);
        
        
        if (payload.pedido_aceptado){
          // Obtener todos los conductores que tienen al cliente en espera, o esta ocupado
          const conductores = this.conductores.getConductoresByClienteId(payload.socket_client_id);
          
          // Primero verifica si hay un conductor que ya a tomado este pedido
          // Esto lo hago, ya que la conexion a internet puede variar, y puede existir alguien que le dio el boton y todavia este procesando, entonces
          // si el otro tiene mejor conexion para evitar un choque de dos conductores al mismo cliente, se notifica que este pedido ya a sido tomado por otro
          // conductor
          if (conductores.some((conductor: ConductorModels) => conductor.status === 'OCUPADO')){
            socket.emit('pedido ya tomado');
            return;
          }
          
          this.conductores.updateStatus({
            clientId: payload.cliente_id,
            socketClientId: payload.socket_client_id,
            socketId: socket.id,
            status: 'OCUPADO',
            pedidoId: payload.pedido_id
          });
          const conductor = this.conductores.getConductorBySocketId(socket.id);
          console.log(payload.socket_client_id);
          
          this.io.to(payload.socket_client_id).emit('pedido aceptado por conductor', conductor);
          
          // TODO: Emitir un mensaje a todos los conductores que estan en espera con este usuario, que este pedido ya a sido tomado
          conductores.forEach((conductor: ConductorModels) => {
            if (conductor.status === 'EN_ESPERA' && conductor.socketId != socket.id){
              this.conductores.clearStatusBySocketId(conductor.socketId);
              this.io.to(conductor.socketId).emit('pedido ya tomado');
            }
          });


        }else{
          this.conductores.setStatusDisponible(socket.id);
          this.actualizarContador({socketId: payload.socket_client_id, contador: -1, isReset: false});
        }

      });

      // ---------------------CONDUCTOR------------------------------

      socket.on('ya estoy aqui', (payload: DetallePedido) => {

        console.log('Ya estoy aqui');
        console.log(payload);

        this.io.to(payload.socket_client_id).emit('El conductor ya esta aqui');
        
      });

      // ---------------------CONDUCTOR-----------------------------

      socket.on('finalizar pedido', (payload: DetallePedido) => {

        this.io.to(payload.socket_client_id).emit('pedido finalizado');

      });

      // ---------------------CLIENTE--------------------------------
      socket.on('solicitar', async (payload: DetallePedido) => {
        
        // const url = `${process.env.URL}/conductorDisponible.php`;

        // const formData = new FormData();
        // formData.append('btip', 'BUES');
        // const resp = await axios.post(url, formData);

        //   // 'btip': 'BUES'
        // console.log('Cantidad de conductores');
        
        // console.log(resp.data);
        

        

        // el origen, destino, el [0] es la latitud y el [1] es la longitud
        console.log(`El cliente ${socket.id} esta solicitando un pedido de ${payload.servicio} en ${payload.origen} hasta el ${payload.destino}`);
         
        console.log(payload);
        payload.socket_client_id = socket.id;
        this.enviarSolicitud(socket, payload);
      
      });

      // -----------------------------CLIENTE------------------------------
      socket.on('cancelar pedido cliente', (payload: {cliente_id: string}) => {

        console.log(`El cliente ${socket.id} ha cancelado el pedido`);
        
        const conductores = this.conductores.getConductoresByClienteId(payload.cliente_id);

        conductores.forEach(conductor => {
          this.solicitudCancelada(conductor.socketId);
          this.conductores.setStatusDisponible(conductor.socketId);
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

  private solicitudCancelada(socketId:string){
    this.io.to(socketId).emit('solicitud cancelada', {});
  }

  private actualizarContador = (data: {socketId: string, contador: number, isReset: boolean}) => {
    this.io.to(data.socketId).emit('actualizar contador', {
      contador: data.contador,
      isReset: data.isReset
    });
  }

  private enviarSolicitud = (socket: Socket, payload: DetallePedido) => {

    var cantidadDisponible = 0;

    const conductor = this.conductores.getConductorDistanciaCorta({lat: payload.origen[0], lng: payload.origen[1]});
    
    this.conductores.updateStatus({
      clientId: payload.cliente_id,
      socketClientId: payload.socket_client_id,
      socketId: conductor.socketId,
      status: 'EN_ESPERA',
      pedidoId: payload.pedido_id 
    });

    if (conductor.id === ''){

      console.log('para el cliente. No hay conductores disponibles');
      
      this.io.to(payload.socket_client_id).emit('respuesta solicitud usuario', {
        'ok': false,
        'msg' : 'No hay conductores disponibles',
      });
    }else{

      console.log('Desde el cliente, solicitud enviada al conductor');
      this.io.to(conductor.socketId).emit('notificacion pedido conductor', {
        'ok': true,
        'msg': 'Hay un nuevo cliente',
        payload
        
      });
    
    }

    this.actualizarContador({socketId: socket.id,contador: cantidadDisponible, isReset: true});


  
  }

}



export default SocketsConfig;