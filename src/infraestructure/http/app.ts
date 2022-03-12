import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import * as http from "http";
import { v1Router } from "./api/v1";
import { billingJob } from "../../bounded_contexts/operations/application/billingJob";

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

Sentry.init({
    dsn: "https://9b2a5dd18dc3451fb38e9050b13df102@o968175.ingest.sentry.io/5919601",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({
            // to trace all requests to the default router
            app,
            // alternatively, you can specify the routes you want to trace:
            // router: someRouter,
        }),
    ],
    debug: true,
    tracesSampleRate: 1.0,
});

app.use("/api/v1", v1Router);
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// the rest of your app

app.use(Sentry.Handlers.errorHandler());

billingJob.initialize();

// New api versions can go here

const server = app.listen(process.env.PORT || 3001, () => {
    console.log(`[App]: Server listening on 3001`);
});

setInterval(function () {
    http.get("http://lets-cook-blog.herokuapp.com");
}, 1800000); // every 30 min

// Hot reload

type ModuleId = string | number;
interface WebpackHotModule {
    hot?: {
        data: any;
        accept(dependencies: string[], callback?: (updatedDependencies: ModuleId[]) => void): void;
        accept(dependency: string, callback?: () => void): void;
        accept(errHandler?: (err: Error) => void): void;
        dispose(callback: (data: any) => void): void;
    };
}

declare const module: WebpackHotModule;

if (module.hot) {
    module.hot.accept();

    module.hot.dispose(() => server.close());
}

export { app };
