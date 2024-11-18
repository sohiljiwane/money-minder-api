import { Router } from 'express';
import { updateProfile, getProfile } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', upload.single('avatar'), updateProfile);

export default router;