import { jwtTokenService } from "../../application/tokenService";
import { mockUserRepository, mongooseUserRepository } from "../../infra/repositories/user";
import { GetUserById } from "./getUserById";
import { GetUserByIdController } from "./getUserByIdController";

// export const getUserById: GetUserById = new GetUserById(mockUserRepository);
export const getUserById: GetUserById = new GetUserById(mongooseUserRepository);
export const getUserByIdController: GetUserByIdController = new GetUserByIdController(getUserById);
