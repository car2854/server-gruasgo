import { getDistanciaHelpers } from "./get_distancia.helper";

export const getIdConductorCercano = (conductores: ConductorDbModel[], origen: any) => {

  let distanciaCorta = 999999999999;
  let idConductor = 0;
  conductores.forEach((data) => {
    

    
    const distancia = getDistanciaHelpers(origen[0], origen[1], data.Lat, data.Log);
    console.log('distancia');
    
    console.log(distancia);
    
    if (distancia < distanciaCorta){
      distanciaCorta = distancia;
      idConductor = data.idConductor;
    }

  });

  console.log('el id conductor es');
  console.log(idConductor);
  
  
  return idConductor;
}