import axios from "axios";

const getConductoresDisponibles = async (servicio: string) => {
  const url = `${process.env.URL}/conductorDisponible.php`;

  const formData = new FormData();
  formData.append('btip', 'BUES');
  formData.append('bestado', 'ES');
  formData.append('bsubservicio', servicio);
  
  const resp = await axios.post(url, formData);

  return resp;
}
const actualizarBanderaConductor = async(data: {
  bandera: string,
  estado: string,
  servicio: string,
  idConductor: string
}) => {
  const url = `${process.env.URL}/conductorDisponible.php`;

  const formData = new FormData();
  formData.append('btip', 'updBandera');
  formData.append('bbandera', data.bandera);
  formData.append('bestado', data.estado);
  formData.append('bsubservicio', data.servicio);
  formData.append('bidconductor', data.idConductor);
  const resp = await axios.post(url, formData);

  return resp;
}


export {
  getConductoresDisponibles,
  actualizarBanderaConductor
}