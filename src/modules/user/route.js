import express from 'express'
import { validateJwt } from '../../middlewares/auth.js';
import { getUser } from './controller.js';
const user = express();

user.get('/:id', validateJwt, getUser);

export default user;