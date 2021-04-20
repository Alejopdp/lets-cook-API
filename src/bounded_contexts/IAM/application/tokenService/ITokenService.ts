export interface ITokenService {
    signLoginToken(payload: any, seed: any): string;
    isLoginTokenVerified(token: string, seed: any): Promise<string | object>;
}
