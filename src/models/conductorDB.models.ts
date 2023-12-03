class ConductorDbModel{
  constructor(
    public id: string,
    public idConductor: number,
    public Lat: number,
    public Log: number,
    public Estado: string,
    public IdPedido: number,
    public SubServicio: string,
    public bandera: boolean
  ){}
}