import express from 'express'
import { validateJwt } from '../../middlewares/auth.js';
import { addUserToAnOrganisation, createOrganisation, getOrganisation, listOrganisation } from './controller.js';
const organisation = express.Router();


organisation.post('/', validateJwt, createOrganisation);

organisation.post('/:orgId/users', validateJwt, addUserToAnOrganisation)

organisation.get('/', validateJwt, listOrganisation)

organisation.get('/:orgId', validateJwt, getOrganisation)

export default organisation;