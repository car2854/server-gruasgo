import { getDistanciaHelpers } from "./get_distancia.helper";

export const getIdConductorCercano = (conductores: ConductorDbModel[], origen: any) => {

  let distanciaCorta = 999999999999;
  let idConductor = '';
  conductores.forEach((data) => {
    
    const distancia = getDistanciaHelpers(origen[0], origen[1], data.Lat, data.Lng);
    if (distancia < distanciaCorta){
      distanciaCorta = distancia;
      idConductor = data.idConductor;
    }

  });

  return idConductor;
}