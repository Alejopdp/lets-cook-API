import { awsSesV3Service } from "../../../../shared/notificationService";
import { jwtTokenService } from "../../application/tokenService";
import { mongooseRoleRepository } from "../../infra/repositories/role";
import { mongooseUserRepository } from "../../infra/repositories/user";
import { CreateUserAsAdmin } from "./createUserAsAdmin";
import { CreateUserAsAdminController } from "./createUserAsAdminController";

export const createUserAsAdmin: CreateUserAsAdmin = new CreateUserAsAdmin(
    mongooseUserRepository,
    mongooseRoleRepository,
    awsSesV3Service,
    jwtTokenService
);
export const createUserAsAdminController: CreateUserAsAdminController = new CreateUserAsAdminController(createUserAsAdmin);
