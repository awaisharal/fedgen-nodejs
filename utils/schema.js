const Joi = require('joi');
const regSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'any.required': "email is a required parameter",
		'string.email': "Invalid email address"
	}),
	name: Joi.string().min(3).max(16).required().messages({
		'any.required': "name is a required parameter",
		'string.min': "name should be greater than 3 characters",
		'string.max': "name should be less than 16 characters",
	}),
	password: Joi.string().required().messages({
		'any.required': "password is a required parameter",
		'any.only': "passwords must match",
	}),
	cpassword: Joi.any().valid(Joi.ref('password')).required().messages({
		'any.only': "passwords must match",
	})

});

const loginSchema = Joi.object({
    email: Joi.string().required().email().messages({
      "any.required": `Email is a required field`,
      "string.empty": `Email can not be empty`,
      "string.email": `Enter a valid email`
    }),
    password: Joi.string().required().messages({
      "any.required": `Password is a required field`,
      "string.empty": `Password can not be empty`,
    })
  })

module.exports = {
    regSchema,
    loginSchema
}