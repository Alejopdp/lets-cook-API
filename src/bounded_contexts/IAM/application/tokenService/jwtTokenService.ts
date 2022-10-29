import { AdminLoginTokenPayload, CustomerLoginTokenPayload, ITokenService } from "./ITokenService";
import jwt from "jsonwebtoken";

export class JwtTokenService implements ITokenService {
    public signAdminLoginToken(payload: AdminLoginTokenPayload): string {
        return jwt.sign(payload, process.env.JWT_SEED as string, { expiresIn: "7d" });
    }

    public async verifyAndGetAdminTokenPayloadOrUndefined(token: string): Promise<AdminLoginTokenPayload | undefined> {
        try {
            const decoded: AdminLoginTokenPayload = await (<AdminLoginTokenPayload>jwt.verify(token, process.env.JWT_SEED as string));

            return decoded;
        } catch (error: any) {
            return undefined;
        }
    }

    public signLoginToken(payload: any): string {
        return jwt.sign(payload, process.env.JWT_SEED as string, { expiresIn: "730d" });
    }

    public getUpdateEmailToken(payload: { email: string }): string {
        return jwt.sign(payload, process.env.JWT_SEED as string, { expiresIn: "1h" });
    }
    public async isTokenVerified(token: string): Promise<string | CustomerLoginTokenPayload | AdminLoginTokenPayload> {
        try {
            const decoded: string | CustomerLoginTokenPayload | AdminLoginTokenPayload = await <string | CustomerLoginTokenPayload | AdminLoginTokenPayload>jwt.verify(token, process.env.JWT_SEED as string);

            return decoded;
        } catch (error: any) {
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
        } catch (error: any) {
            if (error?.name === "TokenExpiredError") expiredToken = true;
            return { email, customerId, expiredToken };
        }
    }

    public passwordGenerationToken(payload: any): string {
        return jwt.sign(payload, process.env.JWT_SEED as string, { expiresIn: "1d" });
    }
}
