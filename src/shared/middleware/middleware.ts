import { Request, Response } from "express";
import { jwtTokenService } from "../../bounded_contexts/IAM/application/tokenService";
import { ITokenService } from "../../bounded_contexts/IAM/application/tokenService/ITokenService";
const rateLimit = require("express-rate-limit");

export class Middleware {
    private _tokenService: ITokenService;

    constructor(tokenService: ITokenService) {
        this._tokenService = tokenService;
    }

    private endRequest(status: 400 | 401 | 403, message: string, res: any): any {
        return res.status(status).json({ message });
    }

    //   public includeDecodedTokenIfExists () {
    //     return async (req: Request, res: Response, next: Function) => {
    //       const token = req.headers['authorization']
    //       // Confirm that the token was signed with our signature.
    //       if (token) {
    //         const decoded = await this.tokenService.isTokenVerified(token, process.env.LOGIN_TOKEN_SEED)
    //         const signatureFailed = !!decoded === false;

    //         if (signatureFailed) {
    //           return this.endRequest(403, 'Token signature expired.', res)
    //         }

    //         // See if the token was found
    //         const { username } = decoded;
    //         const tokens = await this.authService.getTokens(username);

    //         // if the token was found, just continue the request.
    //         if (tokens.length !== 0) {
    //           req.decoded = decoded;
    //           return next();
    //         } else {
    //           return next();
    //         }
    //       } else {
    //         return next();
    //       }
    //     }
    //   }

    public ensureAuthenticated() {
        return async (req: Request, res: Response, next: Function) => {
            const token = req.headers["authorization"];

            if (token) {
                const decoded = await this.tokenService.isTokenVerified(token);
                const signatureFailed = !!decoded === false;

                if (signatureFailed) {
                    return this.endRequest(403, "La sesión ha expirado.", res);
                }

                req["decode"] = decoded;
                next();
            } else {
                return this.endRequest(403, "No se brindó ningún token", res);
            }
        };
    }

    public ensureProcesserAuthenticated = () => {
        return async (req: Request, res: Response, next: Function) => {
            const token = req.headers["authorization"];

            if (token) {
                const decoded = await this.tokenService.isTokenVerified(token);
                const signatureFailed = !!decoded === false;

                if (signatureFailed) return this.endRequest(403, "La sesión ha expirado", res);

                //@ts-ignore
                if (decoded.roleTitle !== "Processer" && decoded.roleTitle !== "Admin")
                    return this.endRequest(401, "No estás autorizado", res);

                req["decode"] = decoded;
                next();
            } else {
                return this.endRequest(403, "No se brindó ningún token", res);
            }
        };
    };

    public ensureAdminAuthenticated = () => {
        return async (req: Request, res: Response, next: Function) => {
            const token = req.headers["authorization"];

            if (token) {
                const decoded = await this.tokenService.isTokenVerified(token);
                const signatureFailed = !!decoded === false;

                if (signatureFailed) {
                    return this.endRequest(403, "La sesión ha expirado.", res);
                }

                //@ts-ignore
                if (decoded.roleTitle! !== "Admin") {
                    return this.endRequest(401, "No estás autorizado", res);
                }

                req["decode"] = decoded;
                next();
            } else {
                return this.endRequest(403, "No se brindó ningún token", res);
            }
        };
    };

    public createRateLimit(mins: number, maxRequests: number) {
        return rateLimit({
            windowMs: mins * 60 * 1000,
            max: maxRequests,
            message: `Solicitaste un nuevo código muchas veces, probá de vuelta en ${mins} minutos`,
        });
    }

    public ensureTokenValid = () => {
        return async (req: Request, res: Response, next: Function) => {
            try {
                const token: string | object = await jwtTokenService.isTokenVerified(req.headers["authorization"] || "");

                if (!token) throw new Error();
                req["decode"] = token;

                next();
            } catch (error) {
                return this.endRequest(403, "La sesión ha expirado", res);
            }
        };
    };

    //   public static restrictedUrl (req, res, next) {

    //     if (!isProduction) {
    //       return next();
    //     }

    //     const approvedDomainList = [
    //       'https://khalilstemmler.com'
    //     ]

    //     const domain = req.headers.origin;

    //     const isValidDomain = !!approvedDomainList.find((d) => d === domain);
    //     console.log(`Domain =${domain}, valid?=${isValidDomain}`)

    //     if (!isValidDomain) {
    //       return res.status(403).json({ message: 'Unauthorized' })
    //     } else {
    //       return next();
    //     }
    //   }

    /**
     * Getter $tokenService
     * @return {ITokenService}
     */
    public get tokenService(): ITokenService {
        return this._tokenService;
    }
}
