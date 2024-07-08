import Joi from 'joi';

export const fetchUserSchema = Joi.object({
    id: Joi.string().uuid().required()
})