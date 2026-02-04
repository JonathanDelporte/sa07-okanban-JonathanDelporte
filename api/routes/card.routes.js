import express from "express";
import { getAll, getById, create, update, deleteById } from '../controllers/card.controller.js';
import { validateCardCreation, validateCardUpdate } from '../middlewares/card.middleware.js';
import { isAllowed, validateId } from '../middlewares/common.middleware.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', validateId, getById);
router.post('/', validateCardCreation, create);
router.patch('/:id', validateId, validateCardUpdate, update);
router.delete('/:id', isAllowed('admin'), validateId, deleteById);

export default router;