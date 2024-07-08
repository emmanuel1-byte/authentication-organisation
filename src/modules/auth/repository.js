import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";
import { Organisation, UserOrganisation } from "../organisation/model.js";
import { User } from "./model.js";

/**
 * Creates a new user and associated organization.
 *
 * @param {Object} data - The user data to create the new user.
 * @param {string} data.firstName - The first name of the user.
 * @param {string} data.lastName - The last name of the user.
 * @param {string} data.email - The email address of the user.
 * @param {string} data.password - The password of the user.
 * @param {string} data.phone - The phone number of the user.
 * @returns {Promise<User>} - The created user object.
 * @throws {Error} - If an error occurs while creating the user and associated organization.
 */
async function createUser(data) {
  try {
    return sequelize.transaction(async (t) => {
      const user = await User.create(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone,
        },
        { transaction: t }
      );
      const organisation = await Organisation.create(
        {
          name: `${user.firstName}'s Organisation`,
        },
        { transaction: t }
      );
      await UserOrganisation.create(
        { userId: user.userId, orgId: organisation.orgId },
        { transaction: t }
      );
      return user;
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Fetches a user by their email address.
 *
 * @param {string} email - The email address of the user to fetch.
 * @returns {Promise<User|null>} - The user object if found, otherwise null.
 * @throws {Error} - If an error occurs while fetching the user.
 */
async function fetchUserByEmail(email) {
  try {
    return await User.findOne({ where: { email: email } });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

const repository = {
  createUser,
  fetchUserByEmail,
};

export default repository;
