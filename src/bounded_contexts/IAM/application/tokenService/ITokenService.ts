import { JwtPayload } from "jsonwebtoken";
import { Permission } from "../../domain/permission/Permission";

export interface AdminLoginTokenPayload extends CustomerLoginTokenPayload {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    roleTitle: string;
    permissions: Permission[];
    email: string;
}

export interface CustomerLoginTokenPayload extends JwtPayload {
    id: string;
    email: string
}

export interface ITokenService {
    signAdminLoginToken(payload: AdminLoginTokenPayload): string;
    signLoginToken(payload: any): string;
    isTokenVerified(token: string): Promise<string | CustomerLoginTokenPayload | AdminLoginTokenPayload>;
    isUpdateEmailVerified(token: string): Promise<{ email: string; customerId: string; expiredToken: boolean }>;
    passwordGenerationToken(payload: any): string;
    getUpdateEmailToken(payload: { email: string; customerId: string }): string;
    verifyAndGetAdminTokenPayloadOrUndefined(token: string): Promise<AdminLoginTokenPayload | undefined>;
}
