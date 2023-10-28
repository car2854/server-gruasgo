import Express, { query } from 'express';
import MapController from '../controllers/map.controller';
import { body } from 'express-validator';
import { validators } from '../middleware/validators.middleware';

const routerMap = Express();

const mapController = new MapController();

routerMap.post('/', 
  [
    body('lat_origen').notEmpty().isNumeric(),
    body('lng_origen').notEmpty().isNumeric(),
    body('lat_destino').notEmpty().isNumeric(),
    body('lng_destino').notEmpty().isNumeric(),
    body('servicio').notEmpty(),
    validators
  ],
  mapController.calculatePrice
);

routerMap.get('/search', mapController.searchPlace)

routerMap.get('/searchPlaceByCoors', mapController.searchPlaceByCoors);

export default routerMap;