import request from "supertest";
import { sequelize } from "../utils/database.js";
import app from "../../index.js";
import { User } from "../modules/auth/model.js";
import {
  Organisation,
  UserOrganisation,
} from "../modules/organisation/model.js";

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: { cascade: true } });
    await Organisation.destroy({ where: {}, truncate: { cascade: true } });
    await UserOrganisation.destroy({ where: {}, truncate: { cascade: true } });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: { cascade: true } });
    await Organisation.destroy({ where: {}, truncate: { cascade: true } });
    await UserOrganisation.destroy({ where: {}, truncate: { cascade: true } });
  });

  describe("POST /api/auth/register", () => {
    const validUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      phone: "1234567890",
    };

    it("should register user successfully with default organisation", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(validUser)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Registration successfull");
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data.user).toMatchObject({
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        email: validUser.email,
        phone: validUser.phone,
      });

      const org = await Organisation.findOne();
      expect(org.name).toBe("John's Organisation");
    });

    it("should fail if required fields are missing", async () => {
      const validUser = {
        phone: "1234567890",
      };

   
        const res = await request(app)
          .post("/api/auth/register")
          .send(validUser)
          .expect(422);

        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toHaveProperty("field");
        expect(res.body.errors).toHaveProperty("message");
    });

    it("should fail if there's duplicate email", async () => {
      await request(app).post("/api/auth/register").send(validUser);

      const res = await request(app)
        .post("/api/auth/register")
        .send(validUser)
        .expect(422);

      expect(res.body.message).toBe("Email already in use");
    });
  });

  describe("POST /api/auth/login", () => {
    const user = {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "password123",
      phone: "0987654321",
    };

    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(user);
    });

    it("should log the user in successfully", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: user.email, password: user.password })
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Login successfull");
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data.user).toMatchObject({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    });

    it("should fail with invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: user.email, password: "wrongpassword" })
        .expect(401);

      expect(res.body.status).toBe("Bad request");
      expect(res.body.message).toBe("Authentication failed");
    });

    it("should fail with non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@example.com", password: "password123" })
        .expect(404);

      expect(res.body.status).toBe("error");
      expect(res.body.message).toBe("User not found!");
    });
  });
});
