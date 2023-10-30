class ConductorModels{

  constructor(
    public id: string,
    public socketId: string,
    public lat: string,
    public lng: string,
    public servicio: string,
    public status: 'DISPONIBLE' | 'OCUPADO' | 'EN_ESPERA',
    public cliente?: {
      id: string,
      socketid: string
    }
  ){}

}

export default ConductorModels;