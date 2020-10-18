import { Router } from 'express';
import orphanagesRoutes from './orphanagesRoutes';

const apiRoutes = Router();

apiRoutes.use('/orphanages', orphanagesRoutes);

export default apiRoutes;
