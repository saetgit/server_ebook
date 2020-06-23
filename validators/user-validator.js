const Joi = require("@hapi/joi");

module.exports = {
  validation: schema => {
    return (req, res, next) => {

      if (req.file) {
        req.body.avatar = req.file;
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
    signUpSchema: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string()
        .optional()
        .allow("")
        .allow(null),
      family: Joi.string()
        .optional()
        .allow("")
        .allow(null),
      address: Joi.string()
        .optional()
        .allow("")
        .allow(null),
      website: Joi.string()
        .optional()
        .allow("")
        .allow(null),
      mobile: Joi.string()
        .optional()
        .allow("")
        .allow(null),
      // type: Joi.string()
      //   .required()

      // provider: Joi.string().optional(),
      // provider_user_id: Joi.string().optional(),
    }),
    signInSchema: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required()
    }),
    updateUserSchema: Joi.object({
      name: Joi.string().required(),
      family: Joi.string().required(),
      mobile: Joi.string().required(),
      address: Joi.string().required(),
      website: Joi.string()
        .optional()
        .allow(null)
        .allow(""),
      
      phone: Joi.string()
        .optional()
        .allow(null)
        .allow("")
    }),
    

  }
};
