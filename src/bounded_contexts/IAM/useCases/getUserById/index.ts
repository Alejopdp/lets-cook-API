import { jwtTokenService } from "../../application/tokenService";
import { mockUserRepository } from "../../infra/repositories/user";
import { GetUserById } from "./getUserById";
import { GetUserByIdController } from "./getUserByIdController";

export const getUserById: GetUserById = new GetUserById(mockUserRepository);
export const getUserByIdController: GetUserByIdController = new GetUserByIdController(getUserById);
