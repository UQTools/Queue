import "./config";
import express, { Express, Response } from "express";
import { createServer } from "http";

import asyncHandler from "express-async-handler";
// import { uqAuthMiddleware } from "./auth/uqAuthMiddleware";
import cors from "cors";
import * as path from "path";

const main = async () => {
    const app: Express = express();
    const server = createServer(app);
    const port = process.env.PORT || 5000;

    // Automatically serve the index.html file from the build folder
    app.set("trust proxy", "loopback");
    app.use(
        cors({
            credentials: true,
            origin: process.env.CORS_ORIGIN,
        })
    );
    app.use("/", express.static("build/client"));

    // app.use(asyncHandler(uqAuthMiddleware));

    // Catch-all route
    app.use("*", (_, res: Response) => {
        res.sendFile("index.html", {
            root: path.resolve("./build", "client"),
        });
    });

    server.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};

main().catch((err) => {
    console.error(err);
    console.error(err.details);
});
