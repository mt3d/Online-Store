import { Express, Router } from "express";
import { createAdminCatalogRoutes } from "./admin_catalog_routes";

export const createAdminRoutes = (app: Express) => {
    app.use((req, res, next) => {
        res.locals.layout = false; // Disable the default layout for the template engine.
        next();
    });

    const cat_router = Router();
    createAdminCatalogRoutes(cat_router);
    app.use("/api/products", cat_router);

    app.get("/admin", (req, res) => res.render("admin/admin_layout"));
}