export interface DetallePedido{
  origen: any, 
  destino: any, 
  servicio: string,
  cliente: string,
  cliente_id: string,
  nombre_origen: string,
  nombre_destino: string,
  descripcion_descarga: string,
  referencia: number,
  monto: number,
  socket_client_id: string,
  pedido_aceptado? :boolean,
  pedido_id: string
}