export const getDistanciaHelpers = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const radioTierra = 6371; // Radio de la Tierra en kilómetros
  console.log(lat1);
  console.log(lon1);
  console.log(lat2);
  console.log(lon2);
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = radioTierra * c;

  return distancia;
}

const toRadians = (grados: number): number => {
  return grados * (Math.PI / 180);
}