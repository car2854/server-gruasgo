
class ConductorModel{
  constructor(
    public id: string,
    public socket: string,
    public lat: number,
    public lng: number,
    public estado: 'libre' | 'ocupado' | 'en_espera',
    public servicio: string
  ){}
}

class PedidoModel{
  constructor(
    public idPedido: string,
    public socket: string,
    public idConductorAceptado: string | null,
    public idConductoresRechazados: string[]
  ){}
}

export {
  ConductorModel,
  PedidoModel,
}