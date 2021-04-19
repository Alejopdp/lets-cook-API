import express from "express";
import { roleRouter } from "../../../bounded_contexts/IAM/infra/http/role";

const v1Router = express.Router();

// v1Router.use("/user", userRouter);
v1Router.use("/role", roleRouter);

// All routes go here

export { v1Router };
