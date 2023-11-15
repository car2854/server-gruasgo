import { getDistanciaHelpers } from "./get_distancia.helper";

export const getIdConductorCercano = (conductores: ConductorDbModel[], origen: any, destino: any) => {

  let distanciaCorta = 999999999999;
  let idConductor = '';
  conductores.forEach((data) => {
    
    const distancia = getDistanciaHelpers(origen[0], destino[0], origen[1], destino[1]);
    if (distancia < distanciaCorta){
      distanciaCorta = distancia;
      idConductor = data.idConductor;
    }

  });

  return idConductor;
}