import { Request, Response } from 'express';

import axios from 'axios';

export default class MapController{

  public searchPlaceByCoors = async(req:Request, res:Response) => {
    try {
      
      const {lat, lng} = req.query;

      if (lat === null || lng === null){
        return res.status(400).json({
          ok: false,
          msg: 'Debe enviar lat y lng en el query'
        });
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.API_KEY_GOOGLE_MAP}`;
      const resp = await axios.get(url);
      
      return res.json({
        ok: true,
        place: resp.data['results'][0]['address_components']
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: 'Check with the administrator'
      });
    }
  }

  public searchPlace = async(req:Request, res:Response) => {
    try {
      
      const place = req.query.place ?? '';

      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&region=BO&key=${process.env.API_KEY_GOOGLE_MAP}&limit=5`;
      
      const resp = await axios.get(url);
      
      const list = [{}];

      resp.data['results'].forEach((element:any) => {
        
        if (list.length === 6) return;
        
        if (element){
          list.push({
            name: element['name'],
            position: element['geometry']['location']
          });
        }
      });
      
      return res.json({
        ok: true,
        places: list
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: 'Check with the administrator'
      });
    }
  }

  public calculatePrice = async(req:Request, res:Response) => {
    try {
      
      const { lat_origen, lng_origen, lat_destino, lng_destino, servicio } = req.body;



      const resp = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${lat_destino},${lng_destino}&origins=${lat_origen},${lng_origen}&key=${process.env.API_KEY_GOOGLE_MAP}`);
      
      const text: string = resp.data.rows[0].elements[0].distance.text;
      const distancia = text.substring(0, text.length - 3);
      
      // const respCost = await axios.post(`https://nesasbolivia.com/gruasgo/pedido.php`, {
      //   'btip': 'costo',
      //   'bkilometros': '2.0',
      //   'bserv': 'gruas'
      // });

      // console.log(respCost.data);
      
      return res.json({
        ok: true,
        distancia
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: 'Check with the administrator'
      });
    }
  }

}