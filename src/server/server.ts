import "reflect-metadata";
import "./config";
import express, { Express, Response } from "express";
import { createServer } from "http";
import asyncHandler from "express-async-handler";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

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
import { CourseStaffResolver } from "./resolvers/course-staff-resolver";

const app: Express = express();
const server = createServer(app);
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
    const options: Redis.RedisOptions = {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        retryStrategy: (times) => Math.max(times * 100, 3000),
    };

    // create Redis-based pub-sub
    const pubSub = new RedisPubSub({
        publisher: new Redis(options),
        subscriber: new Redis(options),
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                QueueResolver,
                CourseResolver,
                CourseStaffResolver,
                RoomResolver,
                QuestionResolver,
                UserResolver,
            ],
            pubSub,
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
