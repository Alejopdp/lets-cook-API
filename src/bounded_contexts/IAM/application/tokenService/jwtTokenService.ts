import { ITokenService } from "./ITokenService";
import jwt from "jsonwebtoken";

export class JwtTokenService implements ITokenService {
    public signLoginToken(payload: any): string {
        return jwt.sign(payload, process.env.JWT_SEED as string, { expiresIn: "730d" });
    }

    public getUpdateEmailToken(payload: { email: string }): string {
        return jwt.sign(payload, process.env.JWT_SEED as string, { expiresIn: "1h" });
    }
    public async isTokenVerified(token: string): Promise<string | object> {
        try {
            const decoded: string | object = await jwt.verify(token, process.env.JWT_SEED as string);

            return decoded;
        } catch (error) {
            return "";
        }
    }

    public async isUpdateEmailVerified(token: string): Promise<{ email: string; customerId: string; expiredToken: boolean }> {
        let email = "";
        let customerId = "";
        let expiredToken = false;
        try {
            const decoded: { email: string; customerId: string } = (await jwt.verify(token, process.env.JWT_SEED as string)) as {
                email: string;
                customerId: string;
            };

            email = decoded.email;
            customerId = decoded.customerId;

            return { email, customerId, expiredToken };
        } catch (error) {
            if (error.name === "TokenExpiredError") expiredToken = true;
            return { email, customerId, expiredToken };
        }
    }

    public passwordGenerationToken(payload: any): string {
        return jwt.sign(payload, process.env.JWT_SEED as string, { expiresIn: "1d" });
    }
}
