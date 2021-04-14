import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { v1Router } from "./api/v1";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use(compression())
app.use(helmet());

app.use("/api/v1", v1Router);

// New api versions can go here

const server = app.listen(process.env.PORT || 9044, () => {
  console.log(`[App]: Server listening on 9044`);
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
