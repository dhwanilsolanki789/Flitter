import Joi from "joi";

const fleetSchema = Joi.object({
    fleet : Joi.object({
        username : Joi.string().required().max(25),
        text : Joi.string().required(),
        time : Joi.string().required()
    }).required()
})

export default fleetSchema;