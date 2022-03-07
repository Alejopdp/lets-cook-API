export interface ITokenService {
    signLoginToken(payload: any): string;
    isTokenVerified(token: string): Promise<string | object>;
    isUpdateEmailVerified(token: string): Promise<{ email: string; customerId: string }>;
    passwordGenerationToken(payload: any): string;
    getUpdateEmailToken(payload: { email: string; customerId: string }): string;
}
