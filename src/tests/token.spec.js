import { generateToken } from "../helpers/generateToken.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const { JWT_SECRET } = process.env;


describe("Token generation", () => {
    test("should generate a token with correct expiration and user details", () => {
      const userId = "testUserId";
      const { accessToken } = generateToken(userId);
  
      // Verify token
      const decoded = jwt.verify(accessToken, JWT_SECRET);
      expect(decoded.sub).toBe(userId);
  
      // Check expiration time
      const now = Math.floor(Date.now() / 1000);
      const ninetyDaysInSeconds = 90 * 24 * 60 * 60;
      expect(decoded.exp).toBeGreaterThan(now);
      expect(decoded.exp).toBeLessThanOrEqual(now + ninetyDaysInSeconds); // Adjusted check
    });
  });