const Joi = require("@hapi/joi");

module.exports = {
  validation: schema => {
    return (req, res, next) => {

      if (req.file) {
        req.body.img = req.file;
      }

      let { error, value } = schema.validate(req.body);

      if (error) return res.status(422).json(error);

      if (!req.value) {
        req.value = {};
      }

      req.value["body"] = value;
      next();
    };
  },
  schema: {
    addProductSchema: Joi.object({
      Title: Joi.string().required(),
      description: Joi.string().optional().allow(null).allow(''),
      auther: Joi.string().required(),
      discount: Joi.string().required(),
      rate: Joi.string().required(),
      price: Joi.string().required(),
      colorClass: Joi.number().required(),
      img: Joi.any().optional()
    }),
    addCartSchema: Joi.object({
      product_id: Joi.number().required()
    }),
  }
};
