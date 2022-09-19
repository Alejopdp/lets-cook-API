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

/** Sentry **/
// Sentry.init({
//     dsn: process.env.SENTRY_DSN,
//     environment: process.env.NODE_ENV,
//     release: "letscook1.0", // TODO: Configure automatic releases info with Github
//     integrations: [
//         // enable HTTP calls tracing
//         new Sentry.Integrations.Http({ tracing: true }),
//         // enable Express.js middleware tracing
//         new Tracing.Integrations.Express({
//             // to trace all requests to the default router
//             app,
//             // alternatively, you can specify the routes you want to trace:
//             // router: someRouter,
//         }),
//         new Sentry.Integrations.Console(),
//         // new Sentry.Integrations.ContextLines(),
//         new Sentry.Integrations.FunctionToString(),
//         new Sentry.Integrations.Modules(),
//         new Sentry.Integrations.InboundFilters(),
//         new Sentry.Integrations.FunctionToString(),
//         new Sentry.Integrations.OnUncaughtException(),
//         new Sentry.Integrations.OnUnhandledRejection(),
//         new Sentry.Integrations.LinkedErrors(),
//     ],
//     debug: true,
//     attachStacktrace: true,
//     autoSessionTracking: true,
//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0,
// });

// // RequestHandler creates a separate execution context using domains, so that every
// // transaction/span/breadcrumb is attached to its own Hub instance
// app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);

// // TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());

// // The error handler must be before any other error middleware and after all controllers
// app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

// // Optional fallthrough error handler
// app.use(function onError(err: any, req: any, res: any, next: any) {
//     // The error id is attached to `res.sentry` to be returned
//     // and optionally displayed to the user for support.
//     res.statusCode = 500;
//     res.end(res.sentry + "\n");
// });

/** End Sentry **/

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

app.use("/api/v1", v1Router);

billingJob.initialize();

// New api versions can go here

const server = app.listen(process.env.PORT || 3001, () => {
    console.log(`[App]: Server listening on 3001`);
    console.log(`[App]: Running in ${process.env.NODE_ENV}`)
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
