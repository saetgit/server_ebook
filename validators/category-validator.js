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
    addCategorySchema: Joi.object({
      category: Joi.string().required(),
      

    }),
 
    
    
    

  
  }
};
