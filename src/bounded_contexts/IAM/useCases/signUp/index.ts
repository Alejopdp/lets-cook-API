import { SignUpController } from "./SignUpController";
import { SignUp } from "./SignUp";

const signUpUseCase = new SignUp();
const signUpController = new SignUpController(signUpUseCase);

export { signUpUseCase, signUpController };
