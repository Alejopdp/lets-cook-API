import { Permission } from "../../domain/permission/Permission";

export interface AdminLoginTokenPayload {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    roleTitle: string;
    permissions: Permission[];
    email: string;
}

export interface ITokenService {
    signAdminLoginToken(payload: AdminLoginTokenPayload): string;
    signLoginToken(payload: any): string;
    isTokenVerified(token: string): Promise<string | object>;
    isUpdateEmailVerified(token: string): Promise<{ email: string; customerId: string; expiredToken: boolean }>;
    passwordGenerationToken(payload: any): string;
    getUpdateEmailToken(payload: { email: string; customerId: string }): string;
    verifyAndGetAdminTokenPayloadOrUndefined(token: string): Promise<AdminLoginTokenPayload | undefined>;
}
