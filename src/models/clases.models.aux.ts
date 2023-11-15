
class UsuarioModel{
  constructor(
    public id: string,
    public socket: string,
  ){}
}

class PedidoModel{
  constructor(
    public idPedido: string,
    public idCliente: string,
    public idConductorAceptado: string | null,
    public idConductorSolicitud: string | null,
    public idConductoresRechazados: string[]
  ){}
}

export {
  UsuarioModel,
  PedidoModel,
}