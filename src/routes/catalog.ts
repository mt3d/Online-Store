import { Express } from "express";

/**
 * Creates the routes that presents a catalog of products to the user.
 */
export const createCatalogRoutes = (app: Express) => {
    app.get("/", (req, res) => {
        res.send("Hello!");
    });
}