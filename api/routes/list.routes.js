import express from 'express';
import { getAll, getById, create, update, deleteById } from '../controllers/list.controller.js';
import { validateListCreation, validateListUpdate } from '../middlewares/list.middleware.js';
import { validateId, isAllowed } from '../middlewares/common.middleware.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', validateId, getById);
router.post('/', validateListCreation, create);
router.patch('/:id', validateId, validateListUpdate, update);
router.delete('/:id', isAllowed('admin'), validateId, deleteById);

export default router;