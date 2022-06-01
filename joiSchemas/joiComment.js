import Joi from "joi";

const commentSchema = Joi.object({
    comment : Joi.object({
        text : Joi.string().required()
    }).required()
})

export default commentSchema;