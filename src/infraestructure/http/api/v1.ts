import express from "express";
import { roleRouter } from "../../../bounded_contexts/IAM/infra/http/role";
import { userRouter } from "../../../bounded_contexts/IAM/infra/http/user";
import { planRouter } from "../../../bounded_contexts/operations/infra/http/plan";
import { recipeRouter } from "../../../bounded_contexts/operations/infra/http/recipe";
import { couponRouter } from "../../../bounded_contexts/operations/infra/http/coupon";
import { shippingRouter } from "../../../bounded_contexts/operations/infra/http/shipping";
import { subscriptionRouter } from "../../../bounded_contexts/operations/infra/http/subscription";

const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/role", roleRouter);
v1Router.use("/plan", planRouter);
v1Router.use("/recipe", recipeRouter);
v1Router.use("/coupon", couponRouter);
v1Router.use("/shipping", shippingRouter);
v1Router.use("/subscription", subscriptionRouter);

// All routes go here

export { v1Router };
