import { ITokenService } from "./ITokenService";
import jwt from "jsonwebtoken";

export class JwtTokenService implements ITokenService {
    public signLoginToken(payload: any): string {
        return jwt.sign(payload, process.env.JWT_SEED as string, { expiresIn: "730d" });
    }
    public async isTokenVerified(token: string): Promise<string | object> {
        try {
            const decoded: string | object = await jwt.verify(token, process.env.JWT_SEED as string);

            return decoded;
        } catch (error) {
            return "";
        }
    }

    public passwordGenerationToken(payload: any): string {
        return jwt.sign(payload, process.env.JWT_SEED as string, { expiresIn: "1d" });
    }
}
