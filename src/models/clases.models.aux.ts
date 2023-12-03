
class UsuarioModel{
  constructor(
    public id: number,
    public socket: string,
  ){}
}

class PedidoModel{
  constructor(
    public idPedido: number,
    public idCliente: number,
    public idConductorAceptado: number | null,
    public idConductorSolicitud: number | null,
    public idConductoresRechazados: number[]
  ){}
}

export {
  UsuarioModel,
  PedidoModel,
}