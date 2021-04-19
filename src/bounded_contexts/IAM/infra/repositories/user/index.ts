import { User } from "../../../domain/user/User";
import { IUserRepository } from "./IUserRepository";
import { MockUserRepository } from "./mockUserRepository";

const mockDatabase: User[] = [];
export const mockUserRepository: IUserRepository = new MockUserRepository([...mockDatabase]);
