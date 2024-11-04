import { Express, Router } from "express";
import { createAdminCatalogRoutes } from "./admin_catalog_routes";
import { createAdminOrderRoutes } from "./admin_order_routes";

export const createAdminRoutes = (app: Express) => {
    app.use((req, res, next) => {
        res.locals.layout = false; // Disable the default layout for the template engine.
        next();
    });

    const cat_router = Router();
    createAdminCatalogRoutes(cat_router);
    app.use("/api/products", cat_router);

    const order_router = Router();
    createAdminOrderRoutes(order_router);
    app.use("/api/orders", order_router);

    app.get("/admin", (req, res) => res.redirect("admin/products"));

    app.get("/admin/products", (req, res) => {
        res.locals.content = "/api/products/table";
        res.render("admin/admin_layout");
    });

    app.get("/admin/products/edit/:id", (req, res) => {
        res.locals.content = `/api/products/edit${req.params.id}`;
        res.render("admin/admin_layout");
    });

    app.get("/admin/orders", (req, res) => {
        res.locals.content = "/api/orders/table";
        res.render("admin/admin_layout");
    });
}