class ConductorDbModel{
  constructor(
    public id: string,
    public idConductor: string,
    public Lat: number,
    public Lng: number,
    public Estado: string,
    public IdPedido: string,
    public SubServicio: string,
    public bandera: boolean
  ){}
}