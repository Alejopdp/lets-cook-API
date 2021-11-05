import { mongooseUserRepository } from "../../bounded_contexts/IAM/infra/repositories/user";
import { mongooseCustomerRepository } from "../../bounded_contexts/operations/infra/repositories/customer";
import { jwtTokenService } from "../../bounded_contexts/IAM/application/tokenService";
import { Middleware } from "./middleware";

export const middleware: Middleware = new Middleware(jwtTokenService, mongooseUserRepository, mongooseCustomerRepository);
