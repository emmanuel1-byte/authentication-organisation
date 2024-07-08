import { generateToken } from "../../helpers/generateToken.js";
import repository from "./repository.js";
import { loginSchema, signupSchema } from "./schema.js";
import bcrypt from "bcrypt";

/**
 * Handles the signup functionality for the application.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the signup process is complete.
 */
export async function signup(req, res, next) {
  try {
    const validatedData = await signupSchema.validateAsync(req.body);
    const newUser = await repository.createUser(validatedData);
    console.log(newUser.userId);

    if (!newUser)
      return res.status(400).json({
        status: "Bad request",
        message: "Registration successful",
        statusCode: 400,
      });

    const { accessToken } = generateToken(newUser.userId);
    return res.status(201).json({
      status: "success",
      message: "Registration successfull",
      data: {
        accessToken,
        user: {
          userId: newUser.userId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles the login functionality for the application.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the login process is complete.
 */
export async function login(req, res, next) {
  try {
    const validatedData = await loginSchema.validateAsync(req.body);
    const user = await repository.fetchUserByEmail(validatedData.email);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found!" });
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid)
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });

    const { accessToken } = generateToken(user.userId);
    return res.status(200).json({
      status: "success",
      message: "Login successfull",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
