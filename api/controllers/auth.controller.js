import { User, Role } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import "dotenv/config";

export async function registerUser(req, res, next) {
    try {
        // On récupère le role user pour avoir son ID
        const userRole = await Role.findOne({
            where: {
                name: "user"
            }
        })
        // On insere notre nouvel utilisateur avec le role user par défaut
        const user = await User.create({
            username: req.body.username,
            password: await argon2.hash(req.body.password),
            role_id: userRole.id
        });
        res.status(StatusCodes.CREATED).json({
            id: user.id,
            username: user.username
        })
    } catch (error) {
        // Permet de verifier si un username equivalent existe deja
        if(error.name === "SequelizeUniqueConstraintError") {
            return res.status(StatusCodes.CONFLICT).json({error: "Username already exists"});
        }
        // Sinon, on transmet l'erreur a la suite de la pile d'execution
        next(error);
        // throw new Error('Internal server error');
    }
}

export async function loginUser(req, res) {
    // On recupere l'utilisateur via son username
    const user = await User.findOne({
        where: {
            username: req.body.username
        }
    });
    // On verifie si l'utilisateur n'existe pas ou si le mot de passe n'est pas le bon
    if(!user || await !argon2.verify(user.password, req.body.password)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Invalid username or password'});
    }
    const token = jwt.sign({user_id: user.id}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    }); 
    console.log(token);   
    res.status(StatusCodes.OK).json({token: token});
}


// Permet de récupérer les infos de l'utilisateur connecté
export async function getMe(req, res) {
    // req.user
    const user = await User.findByPk(req.user.user_id, {
        attributes: ["id", "username"]
    });
    if(!user) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "User not found"});
    }
    res.json(req.user.user_id);
}