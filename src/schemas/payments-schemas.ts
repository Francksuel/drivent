import Joi from "joi";

export const createPaymentSchema = Joi.object({
  ticketId: Joi.number().integer().required(),
  cardData: Joi.object({
    issuer: Joi.string(),
    number: Joi.string(),
    name: Joi.string(),
    expirationDate: Joi.string(),
    cvv: Joi.string()
  })
});

