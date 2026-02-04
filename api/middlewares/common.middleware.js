import { StatusCodes } from 'http-status-codes';
import jwt from "jsonwebtoken";
import "dotenv/config";

export function validateId(req, res, next) {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ID' });
  }
  next();
}

export function errorHandler(err, _req, res, next) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: err.message,
      details: err.stack
  });
  next();
}

// A pour role de verifier si un token est fourni avec la requete et si ce token est valide
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  // Si le token n'existe ou si le token ne commence pas par Bearer
  if(!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({error: "No token found"});
  }

  // On recupere uniquement le token sans Bearer
  const token = authHeader.split(' ')[1];

  try {
    // On verifie que le token est valide et que sa date d'expiration n'est pas passée.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // On ajoute l'id de l'utilisateur connecté dans la requete pour pouvoir s'en servir plus tard
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({error: "invalid or expired token"});
  }
}