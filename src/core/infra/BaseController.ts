import { awsSesService } from "../../shared/notificationService";
import * as express from "express";
import { logger } from "../../../config";
import { sentryService } from "../../shared/monitoring";

export abstract class BaseController {
    // or even private
    protected req: express.Request = {} as express.Request;
    protected res: express.Response = {} as express.Response;

    protected abstract executeImpl(): Promise<void | any>;

    public async execute(req: express.Request, res: express.Response): Promise<void> {
        this.req = req;
        this.res = res;
        const service = `${this.req.method} ${this.req.protocol}://${this.req.get("host")}${this.req.originalUrl}`;
        logger.debug(service);

        const sentryTransaction = sentryService.createTransaction(this.req.method, this.req.originalUrl);
        try {
            await this.executeImpl();
        } catch (error) {
            sentryService.catchException(error);
        } finally {
            sentryService.endTransaction(sentryTransaction);
        }

        // this.executeImpl();
    }

    public static jsonResponse(res: express.Response, code: number, message: string) {
        return res.status(code).json({ message });
    }

    public ok<T>(res: express.Response, dto?: T) {
        if (!!dto) {
            return res.status(200).json(dto);
        } else {
            return res.sendStatus(200);
        }
    }

    public created(res: express.Response) {
        return res.sendStatus(201);
    }

    public clientError(message?: string) {
        return BaseController.jsonResponse(this.res, 400, message ? message : "Unauthorized");
    }

    public unauthorized(message?: string) {
        return BaseController.jsonResponse(this.res, 401, message ? message : "Unauthorized");
    }

    public paymentRequired(message?: string) {
        return BaseController.jsonResponse(this.res, 402, message ? message : "Payment required");
    }

    public forbidden(message?: string) {
        return BaseController.jsonResponse(this.res, 403, message ? message : "Forbidden");
    }

    public notFound(message?: string) {
        return BaseController.jsonResponse(this.res, 404, message ? message : "Not found");
    }

    public conflict(message?: string) {
        return BaseController.jsonResponse(this.res, 409, message ? message : "Conflict");
    }

    public tooMany(message?: string) {
        return BaseController.jsonResponse(this.res, 429, message ? message : "Too many requests");
    }

    public todo() {
        return BaseController.jsonResponse(this.res, 400, "TODO");
    }

    public fail(error: Error | string) {
        logger.error("error");
        console.log(error);
        const endpoint: string = `${this.req.method} ${this.req.protocol}://${this.req.get("host")}${this.req.originalUrl}`;
        //@ts-ignore
        const userEmail: string | undefined = this.req.currentUser?.email;
        awsSesService.sendErrorEmail(`[${process.env.NODE_ENV}] ${error.toString()}`, endpoint, userEmail);

        return this.res.status(500).json({
            message: error.toString(),
        });
    }
}
