import { logger } from "../../utils/logger.js";
import { User } from "../auth/model.js";

/**
 * Fetches a user by their unique identifier.
 *
 * @param {number} userId - The unique identifier of the user to fetch.
 * @returns {Promise<User|null>} - A promise that resolves to the user if found, or null if not found.
 * @throws {Error} - If an error occurs while fetching the user.
 */
async function fetchUserById(userId) {
  try {
    return await User.findByPk(userId);
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

const repository = {
  fetchUserById,
};

export default repository
