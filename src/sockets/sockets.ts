import { Server, Socket } from 'socket.io';
import ConductorInterface from '../interface/conductor.interface';
import Conductores from '../models/conductores.models';
import { DetallePedido } from '../interface/detalle_pedido.interface';
import ConductorModels from '../models/conductor.models';
import axios from 'axios';
import { PedidoModel, UsuarioModel } from '../models/clases.models.aux';
import { getDistanciaHelpers } from '../helpers/get_distancia.helper';
import { actualizarBanderaConductor, getConductoresDisponibles } from '../services/http.services';
import { getIdConductorCercano } from '../helpers/get_id_conductor_cercano';
import { getConductorNoRechazado } from '../helpers/get_conductor_no_rechazado.helper';

class SocketsConfig {

  private usuarios : UsuarioModel[] = [];
  private pedidos: PedidoModel[] = [];

  private io: Server;

  constructor(io: Server){
    this.io = io;

    this.connection();
  }
  

  // usuario
  private getUsuarioById = (id: string) => this.usuarios.find((usuario) => usuario.id === id);
  private getUsuarioBySocket = (socket: string) => this.usuarios.find((usuario) => usuario.socket === socket);

  private eliminarUsuarioBySocket = (socket: string) => {
    this.usuarios = this.usuarios.filter(usuario => usuario.socket != socket).map(_ => _);
  }

  private agregarNuevoUsuario = (nuevoUsuario: UsuarioModel) => {
    const usuario = this.getUsuarioById(nuevoUsuario.id);
    if (usuario==null) this.usuarios.push(nuevoUsuario);
  }

  // Pedido
  private getPedidoByIdPedido = (idPedido: string) => this.pedidos.find((pedido) => pedido.idPedido === idPedido);
  private getPedidoByIdCliente = (idCliente: string) => this.pedidos.find((pedido) => pedido.idCliente === idCliente);

  private agregarNuevoPedido = (nuevoPedido: PedidoModel) => {
    const pedido = this.getPedidoByIdPedido(nuevoPedido.idPedido);
    if (pedido==null) this.pedidos.push(nuevoPedido);
  }

  private eliminarPedidoByIdPedido = (idPedido:string) => {
    this.pedidos = this.pedidos.filter(pedido => pedido.idPedido != idPedido).map(_ => _);
  }

  private nuevoRechazoPedido = (idConductor: string, idPedido: string) => {

    const pedido = this.getPedidoByIdPedido(idPedido);
    const existe = pedido?.idConductoresRechazados.some((data) => data === idConductor);
    if (!existe){
      pedido?.idConductoresRechazados.push(idConductor);
    }

  }




  private connection(){

    this.io.on('connection', (socket: Socket) => {
      console.log(`El cliente ${socket.id} se ha conectado`);
      
      // -----------------------CONDUCTOR--------------------------------------------
      socket.on('usuario online', async (payload: {id:string, servicio?: string}) => {
        
        
        this.agregarNuevoUsuario(new UsuarioModel( payload.id, socket.id ));

        console.log('usuarios online');
        
        this.usuarios.forEach(element => {
          console.log(element);
        });
        
        console.log(payload.servicio);
        
        if (payload.servicio != null){
          const status = await actualizarBanderaConductor({
            bandera: '0',
            estado: 'ES',
            servicio: payload.servicio,
            idConductor: payload!.id
          });

          console.log('Ver la bandera');
          console.log(status.data);
          
          
        }


      });

      // --------------------------CONDUCTOR-----------------------------------
      socket.on('actualizar coordenadas conductor', (payload: {lat: number, lng: number, rotation:any, idPedido: string}) => {

        
        const pedido = this.getPedidoByIdPedido(payload.idPedido);
        if (pedido){
          const cliente = this.getUsuarioById(pedido.idCliente);
          console.log('enviando las nuevas coordenadas al cliente');
          if (cliente){
            this.io.to(cliente.socket).emit('actualizar posicion conductor', payload);
          }else{
            console.log('El cliente esta desconectado');
          }
        }


      });
      
      // ------------------------CONDUCTOR---------------------------------------

      socket.on('pedido proceso cancelado conductor', (payload: {
        idCliente: string
      }) => {

        const cliente = this.getUsuarioById(payload.idCliente);
        if (cliente){
          this.io.to(cliente.socket).emit('pedido en proceso cancelado');
        }else{
          console.log('El cliente esta desconectado');
        }

      });


      // ------------------------CONDUCTOR---------------------------------------
      socket.on('respuesta del conductor', async (
        payload: {  
          servicio: string,
          cliente: string,
          idCliente: string,
          idPedido: string,
          origen: any,
          destino: any,
          lat: number,
          lng: number,
          pedidoAceptado? :boolean,
        }
      ) => {
        
        // console.log(`un conducto ${payload.pedido_aceptado} de este usuario`);
        const pedido = this.getPedidoByIdPedido(payload.idPedido);
        if (!pedido) return ;



        // Acepta el pedido
        if (payload.pedidoAceptado){
          




          const pedido = this.getPedidoByIdPedido(payload.idPedido);
          const usuario = this.getUsuarioById(pedido!.idCliente);
          const conductor = this.getUsuarioBySocket(socket.id);

          const status = await actualizarBanderaConductor({
            bandera: '0',
            estado: 'ES',
            servicio: payload.servicio,
            idConductor: conductor!.id
          });

          console.log('Respuesta despues de la bandera');
          
          console.log(status.data);
          

          this.io.to(usuario!.socket).emit('pedido aceptado por conductor', {id: conductor?.id, lat: payload.lat, lng: payload.lng});
          
        }else{

          

          // Rechaza el pedido
          const conductorData = this.getUsuarioBySocket(socket.id);

          const status = await actualizarBanderaConductor({
            bandera: '0',
            estado: 'ES',
            servicio: payload.servicio,
            idConductor: conductorData!.id
          });

          console.log('ver bandera');
          console.log(status.data);
          
          


          this.nuevoRechazoPedido(conductorData!.id, payload.idPedido);

          const resp = await getConductoresDisponibles(payload.servicio);
          
          const conductor = getConductorNoRechazado(resp.data, this.usuarios, pedido, payload.origen, payload.destino);
  
          if (conductor != null){
            
            if (conductor){
              this.io.to(conductor.socket).emit('notificacion pedido conductor', {
                'ok': true,
                'msg': 'Hay un nuevo cliente',
                payload
              });
            }
          }else{
            this.eliminarPedidoByIdPedido(payload.idPedido);
            console.log('Pedidos restante');
            this.pedidos.forEach(element => {
              console.log(element);
            });
            
            socket.emit('respuesta solicitud usuario', {
              'ok': false,
              'msg' : 'No hay conductores disponibles',
            });
  
          }

        }

      });

      // ---------------------CONDUCTOR------------------------------

      socket.on('ya estoy aqui', (payload: {idCliente:string}) => {

        const cliente = this.getUsuarioById(payload.idCliente);
        if (cliente){
          this.io.to(cliente.socket).emit('El conductor ya esta aqui');
        }else{
          console.log('El cliente esta desconectado');
          
        }
        
      });

      socket.on('comenzar carrera', (payload: {idCliente:string}) => {

        const cliente = this.getUsuarioById(payload.idCliente);
        console.log('El condfuctor ncomenzar carrera '+payload.idCliente);
        
        if (cliente){
          this.io.to(cliente.socket).emit('El conductor comenzo carrera');
        }else{
          console.log('El cliente esta desconectado');
          
        }
        
      });

      // ---------------------CONDUCTOR-----------------------------

      socket.on('finalizar pedido', (payload: {
        idCliente: string
      }) => {
        const cliente = this.getUsuarioById(payload.idCliente);
        if (cliente){
          this.io.to(cliente.socket).emit('pedido finalizado');
        }else{
          console.log('El cliente esta desconectado');
        }

      });

      // ---------------------CLIENTE--------------------------------
      socket.on('solicitar', async (
      payload: {  
        servicio: string,
        cliente: string,
        idCliente: string,
        pedidoAceptado? :boolean,
        idPedido: string,
        origen: any,
        destino: any
      }) => {
        
        console.log('--------------------------------------------');
        
        
        console.log('Listas de pedidos');
        console.log(this.pedidos);

        console.log('Lista de usuario');
        console.log(this.usuarios);
        
        
        
        const resp = await getConductoresDisponibles(payload.servicio);
        console.log('respuesta del servidor para obtener todos los uaurios libres');
        console.log(resp.data);
        
        
        const conductoresDb : ConductorDbModel[] = resp.data; 
        
        let idConductor = getIdConductorCercano(conductoresDb, payload.origen);
        console.log('El id del conductor la cual se enviara el mensaje');
        console.log(idConductor);
        

        if (idConductor != ''){

          // Agregar nuevo pedido
          this.agregarNuevoPedido(
            new PedidoModel(
              payload.idPedido,
              payload.idCliente,
              null,
              idConductor,
              []
            )
          );
          
          console.log('pedidos');
          
          this.pedidos.forEach(element => {
            console.log(element);
          });
          
          const status = await actualizarBanderaConductor({
            bandera: '1',
            estado: 'ES',
            servicio: payload.servicio,
            idConductor: idConductor
          });

          console.log('ver bandera');
          console.log(status.data);
          

          const usuario = this.getUsuarioById(idConductor);

          console.log('A este conductor se le enviara el mensaje');
          console.log(usuario);

          if (usuario){
            this.io.to(usuario.socket).emit('notificacion pedido conductor', {
              'ok': true,
              'msg': 'Hay un nuevo cliente',
              payload
            });
          }
        }else{

          socket.emit('respuesta solicitud usuario', {
            'ok': false,
            'msg' : 'No hay conductores disponibles',
          });

        }
      
      });

      // -----------------------------CLIENTE------------------------------
      socket.on('cancelar pedido cliente', (payload: {idPedido: string}) => {
        const pedido = this.getPedidoByIdPedido(payload.idPedido);        
        if (pedido && pedido.idConductorSolicitud != null){
          const conductor = this.getUsuarioById(pedido.idConductorSolicitud);
          if (conductor){
            this.io.to(conductor.socket).emit('pedido cancelado desde cliente');
          }
        }

        this.eliminarPedidoByIdPedido(payload.idPedido);

      });

      // -------------------------------------------------------------------
      socket.on('disconnect', () => {
        
        const usuario = this.getUsuarioBySocket(socket.id);
        if (usuario){
          const pedido = this.getPedidoByIdCliente(usuario.id);
          if (pedido){
            if (!pedido.idConductorAceptado){
              if (pedido.idConductorSolicitud != null){
                const conductor = this.getUsuarioById(pedido.idConductorSolicitud);
                if (conductor){
                  this.io.to(conductor.socket).emit('pedido cancelado desde cliente');
                }
              }
              this.eliminarPedidoByIdPedido(pedido.idPedido);

            }
          }
        }

        console.log("este usuario se va a ir");
        console.log(usuario);
        this.eliminarUsuarioBySocket(socket.id);

        console.log('un usuario desconectado');
        this.usuarios.forEach(element => {
          console.log(element); 
        });

      });
    });

  }

}



export default SocketsConfig;