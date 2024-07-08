import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

/**
 * Generates a JWT access token for the provided user ID.
 *
 * @param {string} userId - The ID of the user to generate the token for.
 * @returns {object} - An object containing the generated access token.
 */
export function generateToken(userId) {
  const accessToken = jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: "90 days",
    algorithm: 'HS256'
  });

  return { accessToken };
}
