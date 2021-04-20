export interface ITokenService {
    signLoginToken(payload: any): string;
    isTokenVerified(token: string): Promise<string | object>;
    passwordGenerationToken(payload: any): string;
}
