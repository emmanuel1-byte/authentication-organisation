import Joi from "joi";

export const createOrganisationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
});

export const fetchOrganisationSchema = Joi.object({
  orgId: Joi.string().uuid().required(),
});

export const addUserToAnOrganisationSchema = Joi.object({
    userId: Joi.string().uuid().required()
})
