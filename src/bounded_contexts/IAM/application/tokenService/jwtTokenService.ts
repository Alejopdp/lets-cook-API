import { ITokenService } from "./ITokenService";
import jwt from "jsonwebtoken";

export class JwtTokenService implements ITokenService {
    public signLoginToken(payload: any, seed: any): string {
        return jwt.sign(payload, seed, { expiresIn: "31d" });
    }
    public async isLoginTokenVerified(token: string, seed: any): Promise<string | object> {
        try {
            const decoded: string | object = await jwt.verify(token, seed);

            return decoded;
        } catch (error) {
            return "";
        }
    }
}
