import { Router } from 'express';
import apiRoutes from './v1';

const routes = Router();

routes.use('/v1', apiRoutes);

export default routes;
