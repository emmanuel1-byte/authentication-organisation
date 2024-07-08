import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import repository from "../modules/auth/repository.js";
import { signupSchema } from "../modules/auth/schema.js";
dotenv.config();
const { JWT_SECRET } = process.env;

/**
 * Middleware function that validates the JWT from the Authorization header.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 */
export function validateJwt(req, res, next) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken)
    return res.status(400).json({ message: "Access token required!" });
  jwt.verify(accessToken, JWT_SECRET, (err, payload) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          message: "Your session has expired. Please log in again.",
        });
      }
      return res
        .status(401)
        .json({ message: "Unauthorized access. Please log in." });
    }
    req.accessToken = accessToken;
    req.userId = payload.sub;
    next();
  });
}

/**
 * Middleware function that ensures the email provided in the request body is unique.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing the email.
 * @param {string} req.body.email - The email to check for uniqueness.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Calls the next middleware function if the email is unique, or returns a 409 Conflict response if the email already exists.
 */
export async function ensureUniqueUser(req, res, next) {
  try {
    const validatedData = await signupSchema.validateAsync(req.body);
    const user = await repository.fetchUserByEmail(validatedData.email);
    if (user){
      return res.status(422).json({ message: "Email already in use" });
    }
    next();
  } catch (err) {
    next(err);
  }
}
