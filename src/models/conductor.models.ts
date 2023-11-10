class ConductorModels{

  constructor(
    public id: string,
    public socketId: string,
    public lat: number,
    public lng: number,
    public servicio: string,
    public status: 'DISPONIBLE' | 'OCUPADO' | 'EN_ESPERA',
    public cliente: {
      id: string,
      socketid: string,
      pedidoId: string
    } | null
  ){}

}

export default ConductorModels;