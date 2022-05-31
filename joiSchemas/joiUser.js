import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().required(),
    username : Joi.string().required().max(25),
    email: Joi.string().required(),
    password: Joi.string().required(),
    password2: Joi.string().required()
});

export default userSchema;