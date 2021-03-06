import c, { initApp, Middleware, use, Request, Response, CallbackReturnType as RT, LoggerFunction, initLogger, database } from "curie-server"
import { ReactParser } from "./reactParser";
import ReactDOMServer from 'react-dom/server'
import React from 'react';
import ReactDOM from 'react-dom';
import { MongoDBridge } from "curie-mongo"

// @ts-ignore
global.React = React;
// @ts-ignore
global.ReactDOM = ReactDOM;
// @ts-ignore
global.ReactDOMServer = ReactDOMServer;

(async () => {
  await initApp({
    port: +(process.env["PORT"] || 8000),
    database: '',
    routeParser: ReactParser,
    listeners: ["./listeners", "list.[tj]s"],
    public: "../build",
    preRun: [
      // "npm run build",
      // "npm run postcss:build",
      // "echo Hello"
    ],
  })

  @use()
  // @ts-ignore
  class Logger extends Middleware {
    logger: LoggerFunction = initLogger("Logger", "whiteBright")
    async intercept(req: Request, _res: Response) {
      this.logger(req.url)
      return [null, true] as RT
    }
  }

  @database('mongodb://localhost:27017/finances-tracker')
  class Database extends MongoDBridge {}
})()