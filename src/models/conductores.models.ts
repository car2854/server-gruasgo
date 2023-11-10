import { calculateDistance } from "../middleware/calculateDistance";
import ConductorModels from "./conductor.models";



class Conductores{

  private conductores: ConductorModels[] = [];

  private existConductorById(id:string){
    return this.conductores.some((resp) => resp.id === id);
  }

  private existConductorBySocketId(socketId:string){
    return this.conductores.some((resp) => resp.socketId === socketId);
  }

  public getConductorBySocketId(socketId: string){
    return this.conductores.find((conductor: ConductorModels) => conductor.socketId = socketId);
  }

  public addConductor(data: {id:string, idSocket:string, lat:number, lng:number, servicio:string}){
    if (!this.existConductorById(data.id)){
      this.conductores.push(
        new ConductorModels(
          data.id,
          data.idSocket,
          data.lat,
          data.lng,
          data.servicio,
          'DISPONIBLE',
          null
        )
      );
    }
  }



  public removeConductor(id:string){
    if (this.existConductorById(id)){
      this.conductores = this.conductores.filter((resp:any) => resp.id != id).map((_) => _);
    }
  }

  public updateLatLngBySocketId(data: {socketId: string, lat: number, lng: number}){
    if (this.existConductorBySocketId(data.socketId)){
      this.conductores = this.conductores.map((dataConductores: ConductorModels) => {
        if (dataConductores.socketId === data.socketId){
          dataConductores.lat = data.lat;
          dataConductores.lng = data.lng;
        }
        return dataConductores;
      });
    }
  }

  public clearStatusBySocketId(socketId: string){
    if (this.existConductorBySocketId(socketId)){
      this.conductores = this.conductores.map((conductor: ConductorModels) => {
        if (conductor.socketId === socketId){
          conductor.status = 'DISPONIBLE';
          conductor.cliente = null;
        }
        return conductor;
      });
    }
  }

  public updateStatus(data: {socketId:string, socketClientId: string, clientId: string, status: 'OCUPADO' | 'EN_ESPERA', pedidoId: string}){

    if (this.existConductorBySocketId(data.socketId)){
      this.conductores = this.conductores.map((dataConductor: ConductorModels) => {
        if (dataConductor.socketId === data.socketId) {
          dataConductor.status = data.status;
          dataConductor.cliente = {
            id: data.clientId,
            socketid: data.socketClientId,
            pedidoId: data.pedidoId
          }
        };
        return dataConductor;
      });
    }

  }

  public getConductorDistanciaCorta = (data: {lat: number, lng: number}) : ConductorModels => {

    var conductor: ConductorModels = new ConductorModels('','',-1,-1,'','OCUPADO', null);
    var distancia = 9999999;

    this.conductores.forEach((dataConductores: ConductorModels) => {

      if ((dataConductores.status === 'DISPONIBLE')){
        const dis = calculateDistance({
          lat1: data.lat,
          lon1: data.lng,
          lat2: dataConductores.lat,
          lon2: dataConductores.lng
        });
        
        if (dis < distancia){
          distancia = dis;
          conductor = dataConductores
        };
      }

    });

    
    return conductor;
  }
  
  public getConductoresByClienteId(client_id: string){
    return this.conductores.filter((conductor: ConductorModels) => conductor.cliente?.id === client_id).map(_ => _);
  }
  
  public removeConductorBySocketId(socketId:string){
    if (this.existConductorBySocketId(socketId)){
      this.conductores = this.conductores.filter((resp:any) => resp.socketId != socketId).map((_) => _);
    }
  }

  public setStatusDisponible = (socketId:string) => {
    if (this.existConductorBySocketId(socketId)){
      this.conductores = this.conductores.map((conductor: ConductorModels) => {
        if (conductor.socketId === socketId) {
          conductor.status = 'DISPONIBLE';
          conductor.cliente = null
        };
        return conductor;
      });
    }
  }

  public mostrarConductores(){
    console.log(this.conductores);
  }
}

export default Conductores;