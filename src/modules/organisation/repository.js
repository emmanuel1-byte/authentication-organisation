import { sequelize } from "../../utils/database.js";
import { logger } from "../../utils/logger.js";
import { User } from "../auth/model.js";
import { Organisation, UserOrganisation } from "./model.js";

/**
 * Creates a new organization and associates the given user with it.
 *
 * @param {number} userId - The ID of the user to associate with the new organization.
 * @param {object} data - An object containing the name and description of the new organization.
 * @returns {Promise<Organisation>} - The created organization instance.
 * @throws {Error} - If an error occurs during the operation.
 */
async function create(userId, data) {
  try {
    return sequelize.transaction(async (t) => {
      const organisation = await Organisation.create(
        {
          name: data.name,
          description: data.description,
        },
        { transaction: t }
      );

      await UserOrganisation.create(
        { orgId: organisation.orgId, userId: userId },
        { transaction: t }
      );
      return organisation;
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Adds a user to an organization.
 *
 * @param {number} orgId - The ID of the organization to add the user to.
 * @param {number} userId - The ID of the user to add to the organization.
 * @returns {Promise<UserOrganisation>} - The created UserOrganisation instance.
 * @throws {Error} - If an error occurs during the operation.
 */
async function addtoOrg(orgId, userId) {
  try {
    return await UserOrganisation.create({
      userId: userId,
      orgId: orgId,
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Fetches all organizations associated with the specified user.
 *
 * @param {number} userId - The ID of the user to fetch organizations for.
 * @returns {Promise<Organisation[]>} - An array of organizations associated with the user.
 * @throws {Error} - If an error occurs during the fetch operation.
 */
async function fetchOrganisations(userId) {
  try {
    return await User.findAll({
      where: { userId: userId },
      attributes: [],
      include: {
        model: Organisation,
        through: { attributes: [] },
      },
    });
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

/**
 * Fetches an organization by its ID.
 *
 * @param {number} orgId - The ID of the organization to fetch.
 * @returns {Promise<Organisation>} - The organization with the specified ID.
 * @throws {Error} - If an error occurs during the fetch operation.
 */
async function fetchOrgById(orgId) {
  try {
    return await Organisation.findByPk(orgId);
  } catch (err) {
    logger.error(err.stack);
    throw Error(err);
  }
}

const repository = {
  create,
  fetchOrgById,
  fetchOrganisations,
  addtoOrg,
};

export default repository;
