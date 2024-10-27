import { Express } from "express";
import { catalog_repository } from "../data";

/**
 * Creates the routes that presents a catalog of products to the user.
 */
export const createCatalogRoutes = (app: Express) => {
    app.get("/", async (req, res) => {
        const page = Number.parseInt(req.query.page?.toString() ?? "1");
        const pageSize = Number.parseInt(req.query.pageSize?.toString() ?? "3");
        const result = await catalog_repository.getProducts({ page, pageSize });

        // Math.ceil: Rounds up and returns the smallest integer greater than or equal to a given number.
        res.render("index", { ...result, page, pageSize, pageCount: Math.ceil(result.totalCount / (pageSize ?? 1)) });
    });
}