import { logger } from "../utils/logger.js";
import Joi from "joi";

/**
 * Global error handling middleware.
 * Logs the error and sends an appropriate response to the client.
 *
 * @param {Error} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export function globalErrorHandler(err, req, res, next) {
  logger.error(err.stack);
  if (err instanceof Joi.ValidationError) {
    return res.status(422).json({
      errors: {
        field: err.details[0].path,
        message: err.message,
      },
    });
  }
  return res.status(500).json({ message: "Internal Server Error" });
}

/**
 * Middleware to handle routes that are not found.
 * Sends a 404 response with a message indicating the endpoint does not exist.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export function routeNotFoundHandler(req, res, next) {
  res.status(404).json({ message: "Endpoint does not exist on this server" });
}
