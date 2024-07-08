import repository from "./repository.js";
import { fetchUserSchema } from "./schema.js";

/**
 * Fetches a user by their ID and returns the user data.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the user to fetch.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 */
export async function getUser(req, res, next) {
  try {
    const params = await fetchUserSchema.validateAsync(req.params);
    const user = await repository.fetchUserById(params.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "User found",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    next(err);
  }
}
