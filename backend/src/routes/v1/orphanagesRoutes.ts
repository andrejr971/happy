import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../../config/upload';
import OrphanagesController from '../../controllers/OrphanagesController';

const orphanagesRoutes = Router();
const orphanagesController = new OrphanagesController();
const upload = multer(uploadConfig);

orphanagesRoutes.get('/', orphanagesController.index);
orphanagesRoutes.get('/:id', orphanagesController.show);
orphanagesRoutes.post('/', upload.array('images'), orphanagesController.store);

export default orphanagesRoutes;
