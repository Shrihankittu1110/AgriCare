import express from 'express';
import { getWeather, searchLocationsHandler } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/current', getWeather);
router.get('/forecast', getWeather);
router.get('/search', searchLocationsHandler);

export default router;
