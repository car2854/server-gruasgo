import { calculateDistance } from "../middleware/calculateDistance";

class ConductorModels{

  constructor(
    public id: string,
    public socketId: string,
    public lat: string,
    public lng: string,
    public servicio: string,
    public status: 'AVAILABLE' | 'BUSY',
    public cancel: string[],
    public clienteId?: string
  ){}

}

class Conductores{

  private conductores: ConductorModels[] = [];

  private existConductorById(id:string){
    return this.conductores.some((resp) => resp.id === id);
  }

  private existConductorBySocketId(socketId:string){
    return this.conductores.some((resp) => resp.socketId === socketId);
  }

  public addConductor(data: {id:string, idSocket:string, lat:string, lng:string, servicio:string}){
    if (!this.existConductorById(data.id)){
      this.conductores.push(
        new ConductorModels(
          data.id,
          data.idSocket,
          data.lat,
          data.lng,
          data.servicio,
          'AVAILABLE',
          []
        )
      );
    }
  }

  public removeConductor(id:string){
    if (this.existConductorById(id)){
      this.conductores = this.conductores.filter((resp:any) => resp.id != id).map((_) => _);
    }
  }

  public updateLatLngBySocketId(data: {socketId: string, lat: string, lng: string}){
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

  public updateStatusBusy(data: {socketId:string, socketClientId: string}){

    if (this.existConductorBySocketId(data.socketId)){
      this.conductores = this.conductores.map((dataConductor: ConductorModels) => {
        if (dataConductor.socketId === data.socketId) {
          dataConductor.status = 'BUSY';
          dataConductor.clienteId = data.socketClientId;
        };
        return dataConductor;
      });
    }

  }

  public getConductorDistanciaCorta = (data: {lat: number, lng: number, socketClienteId? : string}) : ConductorModels => {

    var conductor: ConductorModels = new ConductorModels('','','','','','BUSY', []);
    var distancia = 9999999;

    this.conductores.forEach((dataConductores: ConductorModels) => {

      if ((dataConductores.status === 'AVAILABLE') && (data.socketClienteId != null && !dataConductores.cancel.some((dataSome) => dataSome === data.socketClienteId))){
        const dis = calculateDistance({
          lat1: data.lat,
          lon1: data.lng,
          lat2: parseFloat(dataConductores.lat),
          lon2: parseFloat(dataConductores.lng)
        });
        
        if (dis < distancia){
          distancia = dis;
          conductor = dataConductores
        };
      }

    });

    
    return conductor;
  }

  public removeConductorBySocketId(socketId:string){
    if (this.existConductorBySocketId(socketId)){
      this.conductores = this.conductores.filter((resp:any) => resp.socketId != socketId).map((_) => _);
    }
  }
  
  public nuevaCancelacion(socketId:string, socketClienteId:string){
    if (this.existConductorBySocketId(socketId)){
      this.conductores = this.conductores.map((conductor: ConductorModels) => {
        if (conductor.socketId === socketId) conductor.cancel.push(socketClienteId);
        return conductor;
      });
    }
  }

  public mostrarConductores(){
    console.log(this.conductores);
  }
}

export default Conductores;