import Joi from "joi";

const commentSchema = Joi.object({
    comment : Joi.object({
        username: Joi.string().required().max(25),
        text : Joi.string().required()
    }).required()
})

export default commentSchema;