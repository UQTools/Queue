import "./config";
import express, { Express, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connect } from "mongoose";

// import asyncHandler from "express-async-handler";
// import { uqAuthMiddleware } from "./auth/uqAuthMiddleware";
import cors from "cors";
import * as path from "path";

connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app: Express = express();
const server = createServer(app);
const port = process.env.PORT || 5000;

export const io: Server = new Server(server, {
    serveClient: false,
    upgradeTimeout: 30000,
});

io.on("connection", () => {
    console.log("Socket listening");
});

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
