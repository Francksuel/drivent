import Joi from "joi";

export const createPaymentSchema = Joi.object({
  ticketId: Joi.number().integer().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().isoDate().required(),
    cvv: Joi.number().required()
  })
});

