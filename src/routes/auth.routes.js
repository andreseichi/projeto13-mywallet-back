import { Router } from 'express';

import {
  createUser,
  loginUser,
  logoutUser,
} from '../controllers/authController.js';

const router = Router();

router.post('/sign-up', createUser);
router.post('/sign-in', loginUser);
router.delete('/sign-out', logoutUser);

export default router;
