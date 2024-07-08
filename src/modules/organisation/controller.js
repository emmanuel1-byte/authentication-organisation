import userRepository from "../user/repository.js";
import repository from "./repository.js";
import {
  addUserToAnOrganisationSchema,
  createOrganisationSchema,
  fetchOrganisationSchema,
} from "./schema.js";

/**
 * Creates a new organisation.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the organisation data.
 * @param {string} req.body.name - The name of the organisation.
 * @param {string} req.body.description - The description of the organisation.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} - A JSON response containing the details of the created organisation.
 */
export async function createOrganisation(req, res, next) {
  try {
    const validatedData = await createOrganisationSchema.validateAsync(
      req.body
    );
    const newOrganisation = await repository.create(req.userId, validatedData);
    if (!newOrganisation) {
      return res.status(400).json({
        status: "Bad request",
        message: "Client error",
        statusCode: 400,
      });
    }
    return res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: newOrganisation.orgId,
        name: newOrganisation.name,
        description: newOrganisation.description,
      },
    });
  } catch (err) {
    next(err);
  }
}


/**
 * Fetches an organisation by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.orgId - The ID of the organisation to fetch.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} - A JSON response containing the details of the fetched organisation.
 */

export async function getOrganisation(req, res, next) {
  try {
    const params = await fetchOrganisationSchema.validateAsync(req.params);
    const organisation = await repository.fetchOrgById(params.orgId);

    if (!organisation) {
      return res
        .status(404)
        .json({ status: "error", message: "Organisation not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Orgnaisatipn found",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Fetches a list of organisations for the given user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.userId - The ID of the user to fetch organisations for.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} - A JSON response containing the list of organisations for the user.
 */
export async function listOrganisation(req, res, next) {
  try {
    const organisations = await repository.fetchOrganisations(req.userId);
    return res.status(200).json({
      success: "success",
      message: "Organisation retrieved sucessfully",

      data: {
        organisations: organisations.flatMap(org => org.Organisations),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Adds a user to an organisation.
 *
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.orgId - The ID of the organisation to add the user to.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.userId - The ID of the user to add to the organisation.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} - A JSON response indicating the success or failure of the operation.
 */
export async function addUserToAnOrganisation(req, res, next) {
  try {
    const params = await fetchOrganisationSchema.validateAsync(req.params);
    const validatedData = await addUserToAnOrganisationSchema.validateAsync(
      req.body
    );
    const organisation = await repository.fetchOrgById(params.orgId);
    if (!organisation) {
      return res
        .status(404)
        .json({ status: "error", message: "Oragnisatin not found" });
    }
    const user = await userRepository.fetchUserById(validatedData.userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    await repository.addtoOrg(organisation.orgId, user.userId);
    return res.status(200).json({
      status: "success",
      message: "User added to Organisation sucessfully",
    });
  } catch (err) {
    next(err);
  }
}
