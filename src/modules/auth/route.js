import express from 'express'
import { ensureUniqueUser } from '../../middlewares/auth.js';
import { login, signup } from './controller.js';
const auth = express();

auth.post('/register', ensureUniqueUser, signup);

auth.post('/login', login);

export default auth;