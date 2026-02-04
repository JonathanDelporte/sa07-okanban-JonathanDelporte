import Joi from "joi";
import { checkBody } from "../utils/common.util.js";

export async function validateAuthRegister(req, res, next) {
    const authSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(8).max(100).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    })
    checkBody(authSchema, req.body, res, next);
}

export async function validateAuthLogin(req, res, next) {
    const authSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(8).max(100).required(),
    })
    checkBody(authSchema, req.body, res, next);
}