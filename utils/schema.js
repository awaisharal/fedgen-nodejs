
const Joi = require("joi");
const regSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "email is a required parameter",
    "string.email": "Invalid email address",
  }),
  firstName: Joi.string().required().messages({
    "any.required": "name is a required parameter",
    "string.min": "name should be greater than 3 characters",
    "string.max": "name should be less than 16 characters",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "name is a required parameter",
    "string.min": "name should be greater than 3 characters",
    "string.max": "name should be less than 16 characters",
  }),
  password: Joi.string().required().messages({
    "any.required": "password is a required parameter",
    "any.only": "passwords must match",
  }),
  cpassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "passwords must match",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": `Email is a required field`,
    "string.empty": `Email can not be empty`,
    "string.email": `Enter a valid email`,
  }),
  password: Joi.string().required().messages({
    "any.required": `Password is a required field`,
    "string.empty": `Password can not be empty`,
  }),
});

const profile = Joi.object({
  user_id: Joi.string().required().messages({
    "any.required": `user_id is a required field`,
    "string.empty": `user_id can not be empty`,
  }),
  first_name: Joi.string().required().messages({
	"any.required": `user_id is a required field`,
    "string.empty": `user_id can not be empty`,
  }),
  last_name: Joi.string().required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  postcode: Joi.string().optional(),
  bio: Joi.string().optional(),
});
const emailSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": `Email is a required field`,
    "string.empty": `Email can not be empty`,
    "string.email": `Enter a valid email`,
  })
})
const passwordResetSchema = Joi.object({
  newPassword: Joi.string().min(8).max(16).required().messages({
    "any.required": `New Password is a required field`,
    "string.empty": `New Password can not be empty`,
    "string.min": `Password length must be at least 8 characters long`,
    "string.max": `length must be less than or equal to 16 characters long`
  }),
  token: Joi.string().required().messages({
    "any.required": `token is a required field`,
    "string.empty": `token can not be empty`
  })
})

const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().min(8).max(16).required().messages({
    "any.required": `Current Password is a required field`,
    "string.empty": `Current Password can not be empty`,
    "string.min": `Password length must be at least 8 characters long`,
    "string.max": `length must be less than or equal to 16 characters long`
  }),
  newPassword: Joi.string().min(8).max(16).required().messages({
    "any.required": `New Password is a required field`,
    "string.empty": `New Password can not be empty`,
    "string.min": `Password length must be at least 8 characters long`,
    "string.max": `length must be less than or equal to 16 characters long`
  })
})
module.exports = {
  regSchema,
  loginSchema,
  profile,
  emailSchema,
  passwordResetSchema,
  passwordChangeSchema
};
