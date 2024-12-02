import { Router } from 'express';
import { login } from '../controllers/auth.controller';
//import { register } from '../controllers/auth.controller';

const router = Router();

// Route for user registration
//router.post('/register', register);

// Route for user login
router.post('/login', login);

export default router;
