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
import { UserResolver } from "./resolvers/user-resolver";
import { QuestionResolver } from "./resolvers/question-resolver";
import { QueueEvent } from "../events";

const app: Express = express();
const server = createServer(app);
// export const io: Server = new Server(server, {
//     serveClient: false,
//     upgradeTimeout: 30000,
// });
//
// io.on("connection", (socket) => {
//     console.log("client connected");
//     socket.on(QueueEvent.JOIN_ROOM, (roomId: string) => {
//         socket.join(roomId);
//     });
//     socket.on(QueueEvent.LEAVE_ROOM, (roomId: string) => {
//         socket.leave(roomId);
//     });
// });
const port = process.env.PORT || 5000;

const main = async () => {
    await createConnection(ormconfig);
    // Automatically serve the index.html file from the build folder
    app.set("trust proxy", "loopback");
    app.use(
        cors({
            credentials: true,
            origin: process.env.CORS_ORIGIN,
        })
    );

    app.use(asyncHandler(uqAuthMiddleware));

    scheduleJob(endOfDayRule, resetQueues);
    scheduleJob(endOfDayRule, resetQuestionCount);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                QueueResolver,
                CourseResolver,
                RoomResolver,
                QuestionResolver,
                UserResolver,
            ],
            dateScalarMode: "isoDate",
        }),
        subscriptions: {
            path: "/subscriptions",
        },
        context: ({ req, res }): MyContext => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app });
    apolloServer.installSubscriptionHandlers(server);

    app.use("/", express.static("build/client"));

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
});
