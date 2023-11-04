import { Request, Response } from 'express';

import axios from 'axios';

// import {Client} from "@googlemaps/google-maps-services-js";

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
      
      const direccion = resp.data.results[0].formatted_address;
      const componentes = resp.data.results[0].address_components;

      var lugar = '';
      console.log('--------------------------------');
      
      console.log(componentes);
      
      componentes.forEach((componente:any) => {
        if (componente.types.includes('route') || componente.types.includes('sublocality')) {
          if (lugar.length === 0){
            lugar = componente.long_name;
          }else{
            lugar = lugar + ' ' + componente.long_name;
          }
        }
        // Puedes agregar más condiciones según tus necesidades, por ejemplo, para extraer el nombre del lugar
      });

      if(lugar.length === 0){
        lugar = 'Santa Cruz de la Sierra';
      }
      

      return res.json({
        ok: true,
        // place: resp.data['results'][0]['address_components']
        place: lugar
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

      // let client = new Client({});
      // let data1 = await client.placeAutocomplete({
      //   params: {
      //     location: { lat: -17.7867406, lng: -63.1828296},
      //     radius: 31000,
      //     key: process.env.API_KEY_GOOGLE_MAP!,
      //     input: "",
      //     language: "es",
      //     components: ['BO']
      //   },
      //   timeout: 1000
      // });

      // console.log('-----------------');
      // console.log(data1);
      // console.log('-----------------');
      

      // const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&region=BO&location=-17.7867406,-63.1828296&radius=31000&key=${process.env.API_KEY_GOOGLE_MAP}&limit=5`;
      
      const API_KEY = process.env.API_KEY_GOOGLE_MAP;
      const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'

      // const resp = await axios.get(url);
      const resp = await axios.get(baseUrl, {
        params: {
          location: '-17.7867406,-63.1828296',
          radius: 31000,
          key: API_KEY,
          keyword: place,
          language: 'es'
        }
      });

      
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