import { jwtTokenService } from "../../bounded_contexts/IAM/application/tokenService";
import { Middleware } from "./middleware";

export const middleware: Middleware = new Middleware(jwtTokenService);
