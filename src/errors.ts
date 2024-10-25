import { ErrorRequestHandler, Express} from "express";
import { getConfig } from "./config";
import "express-async-errors";

const template404 = getConfig("errors:400");
const template500 = getConfig("errors:500");

export const createErrorHandlers = (app: Express) => {
    // This will be the last handler to run when a request is received.
    app.use((req, res) => {
        res.statusCode = 404;
        res.render(template404);
    });

    const handler: ErrorRequestHandler = (error, req, res, next) => {
        console.log(error);

        /**
         * when you add a custom error handler, you must delegate
         * to the default Express error handler, when the headers 
         * have already been sent to the client */
        if (res.headersSent) {
            return next(error);
        }

        /**
         * There is a danger that something will go wrong when rendering
         * an error response, in which case the default error handler will be used. */
        try {
            res.statusCode = 500;
            res.render(template500, { error });
        } catch (newErr) {
            next(newErr);
        }
    }

    app.use(handler);
}