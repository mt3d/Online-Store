import { Express } from "express";
import { getConfig } from "../config";
import { engine } from "express-handlebars";
import * as env_helpers from "./env";
import * as catalog_helpers from "./catalog_helpers";
import * as cart_helpers from "./cart_helpers";
import * as order_helpers from "./order_helpers";
import * as admin_helpers from "./admin_helpers";

const location = getConfig("templates:location");
const config = getConfig("templates:config");

export const createTemplates = (app: Express) => {
    app.set("views", location);
    app.engine("handlebars", engine({ ...config, helpers: { ...env_helpers, ...catalog_helpers, ...cart_helpers, ...order_helpers, ...admin_helpers } }));
    app.set("view engine", "handlebars");
}