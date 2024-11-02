import { Express } from "express";

export const createAdminRoutes = (app: Express) => {
    app.use((req, res, next) => {
        res.locals.layout = false; // Disable the default layout for the template engine.
        next();
    });

    app.get("/admin", (req, res) => res.render("admin/admin_layout"));
}