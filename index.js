import express from "express";
import {
  globalErrorHandler,
  routeNotFoundHandler,
} from "./src/middlewares/error.js";
import { connectToDatabase, syncDatabase } from "./src/utils/database.js";
import auth from "./src/modules/auth/route.js";
import { logger } from "./src/utils/logger.js";
import user from "./src/modules/user/route.js";
import organisation from "./src/modules/organisation/route.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running..." });
});

app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/organisations", organisation);

app.use(globalErrorHandler);
app.use(routeNotFoundHandler);

if(process.env.NODE_ENV!=='test'){
  app.listen(port, () => {
    connectToDatabase();
    syncDatabase();
    logger.info(`Server is running on port ${port}`);
  });
}

export default app;
