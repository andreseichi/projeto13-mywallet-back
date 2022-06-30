import joi from 'joi';

export const createTransactionSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.string().equal('income', 'outcome').required(),
});
