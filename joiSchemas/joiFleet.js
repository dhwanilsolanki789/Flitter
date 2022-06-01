import Joi from "joi";

const fleetSchema = Joi.object({
    fleet : Joi.object({
        text : Joi.string().required(),
    }).required()
})

export default fleetSchema;