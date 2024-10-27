import { Express } from "express";
import { catalog_repository } from "../data";

/**
 * Creates the routes that presents a catalog of products to the user.
 */
export const createCatalogRoutes = (app: Express) => {
    app.get("/", async (req, res) => {
        const products = await catalog_repository.getProducts();
        res.render("index", { products });
    });
}