import "./config";
import express, { Express, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import asyncHandler from "express-async-handler";

import cors from "cors";
import * as path from "path";
import { createConnection } from "typeorm";
import ormconfig from "./ormconfig";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MyContext } from "./types/context";
import { uqAuthMiddleware } from "./auth/uqAuthMiddleware";
import { QueueResolver } from "./resolvers/queue-resolver";
import { CourseResolver } from "./resolvers/course-resolver";
import { RoomResolver } from "./resolvers/room-resolver";
import { scheduleJob } from "node-schedule";
import { endOfDayRule, resetQuestionCount, resetQueues } from "./jobs/queue";

const app: Express = express();
const server = createServer(app);
export const io: Server = new Server(server, {
    serveClient: false,
    upgradeTimeout: 30000,
});
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

app.use(asyncHandler(uqAuthMiddleware));

// Catch-all route
app.use("*", (_, res: Response) => {
    res.sendFile("index.html", {
        root: path.resolve("./build", "client"),
    });
});

// TODO: clear queue and questions at midnight
const main = async () => {
    await createConnection(ormconfig);
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [QueueResolver, CourseResolver, RoomResolver],
            dateScalarMode: "isoDate",
        }),
        context: ({ req, res }): MyContext => ({ req, res }),
    });

    scheduleJob(endOfDayRule, resetQueues);
    scheduleJob(endOfDayRule, resetQuestionCount);

    apolloServer.applyMiddleware({ app });
    server.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};

main().catch((err) => {
    console.error(err);
});
