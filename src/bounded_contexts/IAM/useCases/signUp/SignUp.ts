import { User } from "../../domain/user/User";
import { SignUpDTO } from "../signUp/SignUpDTO";

export class SignUp {
  public async execute(req: SignUpDTO): Promise<any> {
    const user: User = new User("test", req.name, req.email, false, 420, req.password, req.phoneNumber);

    // TO DO
  }
}
