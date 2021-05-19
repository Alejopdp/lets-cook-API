import { awsSesService, nodemailerService } from "../../../../shared/notificationService";
import { jwtTokenService } from "../../application/tokenService";
import { mockRoleRepository, mongooseRoleRepository } from "../../infra/repositories/role";
import { mockUserRepository, mongooseUserRepository } from "../../infra/repositories/user";
import { CreateUserAsAdmin } from "./createUserAsAdmin";
import { CreateUserAsAdminController } from "./createUserAsAdminController";

// export const createUserAsAdmin: CreateUserAsAdmin = new CreateUserAsAdmin(
//     mockUserRepository,
//     mockRoleRepository,
//     nodemailerService,
//     jwtTokenService
// );

export const createUserAsAdmin: CreateUserAsAdmin = new CreateUserAsAdmin(
    mongooseUserRepository,
    mongooseRoleRepository,
    awsSesService,
    jwtTokenService
);
export const createUserAsAdminController: CreateUserAsAdminController = new CreateUserAsAdminController(createUserAsAdmin);
