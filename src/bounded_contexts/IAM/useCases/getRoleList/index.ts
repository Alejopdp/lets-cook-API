import { mockRoleRepository } from "../../infra/repositories/role";
import { GetRoleList } from "./getRoleList";
import { GetRoleListController } from "./getRoleListController";

export const getRoleList: GetRoleList = new GetRoleList(mockRoleRepository);
export const getRoleListController: GetRoleListController = new GetRoleListController(getRoleList);
