import { User } from "@src/bounded_contexts/IAM/domain/user/User";
import { UserId } from "../../bounded_contexts/IAM/domain/user/UserId";
import { IUserRepository } from "@src/bounded_contexts/IAM/infra/repositories/user/IUserRepository";
import { Customer } from "@src/bounded_contexts/operations/domain/customer/Customer";
import { CustomerId } from "../../bounded_contexts/operations/domain/customer/CustomerId";
import { ICustomerRepository } from "@src/bounded_contexts/operations/infra/repositories/customer/ICustomerRepository";
import { Request, Response } from "express";
import { logger } from "../../../config";
import { jwtTokenService } from "../../bounded_contexts/IAM/application/tokenService";
import { AdminLoginTokenPayload, ITokenService } from "../../bounded_contexts/IAM/application/tokenService/ITokenService";
import { Permission } from "../../bounded_contexts/IAM/domain/permission/Permission";
const rateLimit = require("express-rate-limit");

export class Middleware {
    private _tokenService: ITokenService;
    private _userRepository: IUserRepository;
    private _customerRepository: ICustomerRepository;

    constructor(tokenService: ITokenService, userRepository: IUserRepository, customerRepository: ICustomerRepository) {
        this._tokenService = tokenService;
        this._userRepository = userRepository;
        this._customerRepository = customerRepository;
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

    private async getCurrentUser(isAdmin: boolean, customerOrUserId: string): Promise<User | Customer> {
        if (isAdmin) {
            const user: User | undefined = await this.userRepository.findById(new UserId(customerOrUserId));

            if (!!!user) throw new Error("El usuario que está intentando realizar la solicitud no existe");

            return user;
        }

        return await this.customerRepository.findByIdOrThrow(new CustomerId(customerOrUserId));
    }

    public addCurrentUser() {
        return async (req: Request, res: Response, next: Function) => {
            const token = req.headers["authorization"];

            if (token) {
                const decoded = await this.tokenService.isTokenVerified(token);

                //@ts-ignore
                req["currentUser"] = await this.getCurrentUser(!!decoded.roleId || !!decoded.roleTitle, decoded.id);
                next();
            }
        };
    }

    public ensureAuthenticated() {
        return async (req: Request, res: Response, next: Function) => {
            try {
                const token = req.headers["authorization"];

                if (token) {
                    const decoded = await this.tokenService.isTokenVerified(token);
                    console.log("A ver el decoded: ", decoded);
                    const signatureFailed = !!decoded === false;

                    if (signatureFailed) {
                        return this.endRequest(403, "La sesión ha expirado.", res);
                    }

                    //@ts-ignore
                    req["decode"] = decoded;
                    //@ts-ignore
                    console.log("[debug] User executing the request: ", req["decode"]?.email);
                    //@ts-ignore
                    req["currentUser"] = await this.getCurrentUser(!!decoded.roleId || !!decoded.roleTitle, decoded.id);
                    next();
                } else {
                    return this.endRequest(403, "No estás autorizado para realizar la petición", res);
                }
            } catch (error: any) {
                console.log(error);
                return this.endRequest(403, "No estás autorizado para realizar la petición", res);
            }
        };
    }

    public ensureAdminAuthenticated = (permissions: Permission[]) => {
        return async (req: Request, res: Response, next: Function) => {
            const token = req.headers["authorization"];

            if (token) {
                const decoded: AdminLoginTokenPayload | undefined = await this.tokenService.verifyAndGetAdminTokenPayloadOrUndefined(token);
                const signatureFailed = !!decoded === false || !decoded;

                if (signatureFailed) {
                    return this.endRequest(403, "La sesión ha expirado.", res);
                }
                //@ts-ignore
                const adminUser: User = (await this.getCurrentUser(true, decoded.id))! as User;
                if (!adminUser?.hasPermissions(permissions)) {
                    return this.endRequest(401, "No estás autorizado", res);
                }

                //@ts-ignore
                req["decode"] = decoded;
                next();
            } else {
                return this.endRequest(403, "No estás autorizado para realizar la petición", res);
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
                //@ts-ignore
                req["decode"] = token;

                next();
            } catch (error: any) {
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

    /**
     * Getter userRepository
     * @return {IUserRepository}
     */
    public get userRepository(): IUserRepository {
        return this._userRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}
