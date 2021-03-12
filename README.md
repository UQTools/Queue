# Q

![Node.js CI](https://github.com/CSSE1001/queue/workflows/Node.js%20CI/badge.svg)
![Deploy](https://github.com/CSSE1001/queue/workflows/Deploy/badge.svg)

A simple Q(ueue) to manage students in practical sessions

## Prerequisite
This project uses PostgreSQL as the DBMS and Redis to manage real-time communication 
with the GraphQL server. You must have these 2 applications set up in your local
system to run the project locally. It is also recommended to use Yarn as
your dependency manager.

You also need to somehow mimic the UQCloud's authentication system. You need to 
somehow inject all the requests with authentication headers. The most important
fields are the `X-Uq-Username` header and the `name` and `email` fields of the 
JSON string on the `X-KVD-Payload` header. You can have a look at the headers 
attached to each request by going to [https://mp.uqcloud.net](https://mp.uqcloud.net). 
I use the [Mod Header](https://bewisse.com/modheader/) extension personally, but feel 
free to use whatever you want.

## Setting up dev environment
1. Create a new PostgreSQL database
2. Fill the `.env` file using the template from `.env.example`, with the `DB_URL`field as the URL of your database.
3. Set `CORS_ORIGIN` to `http://localhost:3000`
4. Run `yarn` to install all the dependencies
5. Run `yarn migration-run` to set up your database
6. Run `yarn server-dev` to start the express server
7. Run `yarn client-dev` on another terminal instance to start the React client development server
8. Go to `https://localhost:3000`

## Building
Run `yarn build` to build, the project is built in the `./build` directory. 
Run `node build/server/server.js` to run the server.