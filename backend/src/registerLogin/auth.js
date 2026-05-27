import express from 'express';
import { register } from './register.js';
import { login } from './login.js';
import { logout } from './logout.js';
import { me } from './me.js'

const router = express.Router();

router.post('/register', register);

router.post("/login", login);

router.post('/logout', logout);

router.get('/login/me', me)

export default router;