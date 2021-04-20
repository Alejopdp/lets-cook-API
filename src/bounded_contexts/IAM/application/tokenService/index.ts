import { ITokenService } from "./ITokenService";
import { JwtTokenService } from "./jwtTokenService";

export const jwtTokenService: ITokenService = new JwtTokenService();
