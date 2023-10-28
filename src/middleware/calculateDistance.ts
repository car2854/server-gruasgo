export const calculateDistance = (data: {lat1: number, lon1: number, lat2: number, lon2: number}): number => {
  const radioTierra = 6371; // Radio de la Tierra en kilómetros

  // Convertir las latitudes y longitudes de grados a radianes
  data.lat1 = gradosARadianes(data.lat1);
  data.lon1 = gradosARadianes(data.lon1);
  data.lat2 = gradosARadianes(data.lat2);
  data.lon2 = gradosARadianes(data.lon2);

  // Diferencia de latitud y longitud
  const dLat = data.lat2 - data.lat1;
  const dLon = data.lon2 - data.lon1;

  // Fórmula de Haversine
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(data.lat1) * Math.cos(data.lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distancia en kilómetros
  const distancia = radioTierra * c;
  return distancia;
}

const gradosARadianes = (grados: number): number => {
  return grados * (Math.PI / 180);
}

