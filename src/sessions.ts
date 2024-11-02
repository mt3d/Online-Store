import session from "express-session";
import sessionStore from "connect-session-sequelize";
import { getConfig, getSecret } from "./config";
import { Sequelize } from "sequelize";
import { Express } from "express";

const config = getConfig("sessions");
const secret = getSecret("COOKIE_SECRET");

const logging = config.orm.logging ? { logging: console.log, logQueryParameters: true } : { logging: false };

export const createSessions = (app: Express) => {
    const sequelize = new Sequelize({ ...config.orm.settings, ...logging });

    const store = new (sessionStore(session.Store))({ db: sequelize });

    if (config.reset_db === true) {
        sequelize.drop().then(() => store.sync())
    } else {
        store.sync();
    }

    app.use(session({
        secret,
        store,
        resave: false, // required by OAuth
        saveUninitialized: true, // required by OAuth
        cookie: {
            maxAge: config.maxAgeHrs * 60 * 60 * 1000 ,
            sameSite: false, // required by OAuth
            httpOnly: false,
            secure: false
        }
    }));
}