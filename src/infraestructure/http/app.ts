import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
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

app.use("/api/v1", v1Router);

billingJob.initialize();

// New api versions can go here

const server = app.listen(process.env.PORT || 3001, () => {
    console.log(`[App]: Server listening on 3001`);
});

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
