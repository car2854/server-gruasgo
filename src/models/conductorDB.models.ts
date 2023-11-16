class ConductorDbModel{
  constructor(
    public id: string,
    public idConductor: string,
    public Lat: number,
    public Log: number,
    public Estado: string,
    public IdPedido: string,
    public SubServicio: string,
    public bandera: boolean
  ){}
}