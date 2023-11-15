import { PedidoModel, UsuarioModel } from "../models/clases.models.aux";
import { getIdConductorCercano } from "./get_id_conductor_cercano";

// Obtener los conductores que no rechazo el pedido, usando recursividad
export const getConductorNoRechazado = (
  conductoresDb: ConductorDbModel[], 
  usuarios: UsuarioModel[],
  pedido: PedidoModel,
  origen: any,
  destino: any
) : UsuarioModel | null => {


  
  if (conductoresDb.length === 0) return null;

  let idConductor = getIdConductorCercano(conductoresDb, origen, destino);

  const conductor = usuarios.find((element) => element.id === idConductor);

  if (conductor){
    const fueRechazado = pedido.idConductoresRechazados.some(element => element === conductor.id);

    if (fueRechazado){
      conductoresDb = conductoresDb.filter((data) => data.idConductor != idConductor).map(_ => _);

      return getConductorNoRechazado(conductoresDb, usuarios, pedido, origen, destino);
    }
  }

  return conductor ?? null;

}