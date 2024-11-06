import { Express, Router, Request, Response, NextFunction } from "express";
import { createAdminCatalogRoutes } from "./admin_catalog_routes";
import { createAdminOrderRoutes } from "./admin_order_routes";
import passport from "passport";
import { getConfig } from "../../config";
import { createDbManagementRoutes } from "./database_routes";

const users: string[] = getConfig("admin:users", []);

export const createAdminRoutes = (app: Express) => {
    app.use((req, res, next) => {
        res.locals.layout = false; // Disable the default layout for the template engine.
        res.locals.user = req.user;
        next();
    });

    app.get("/admin/signin", (req, res) => res.render("admin/signin"));
    app.post("/admin/signout", (req, res) => req.logOut(() => { res.redirect("/admin/signin") }));
    app.get("/admin/google", passport.authenticate("admin-auth"));
    app.get("/auth-signin-google", passport.authenticate("admin-auth", {
        successRedirect: "/admin/products",
        keepSessionInfo: true
    }));

    const authCheck = (r: Request) => {
        return users.find(u => r.user?.email === u)
    }

    const apiAuth = (req: Request, res: Response, next: NextFunction) => {
        if (!authCheck(req)) {
            return res.sendStatus(401);
        }
        next();
    }

    const cat_router = Router();
    createAdminCatalogRoutes(cat_router);
    app.use("/api/products", apiAuth, cat_router);

    const order_router = Router();
    createAdminOrderRoutes(order_router);
    app.use("/api/orders", apiAuth, order_router);

    const db_router = Router();
    createDbManagementRoutes(db_router);
    app.use("/api/database", apiAuth, db_router);

    const userAuth = (req: Request, res: Response, next: NextFunction) => {
        if (!authCheck(req)) {
            console.log("redirecting to sign in");
            return res.redirect("/admin/signin");
        }
        next();
    }

    app.get("/admin", userAuth, (req, res) => res.redirect("admin/products"));

    app.get("/admin/products", userAuth, (req, res) => {
        res.locals.content = "/api/products/table";
        res.render("admin/admin_layout");
    });

    app.get("/admin/products/edit/:id", userAuth, (req, res) => {
        res.locals.content = `/api/products/edit${req.params.id}`;
        res.render("admin/admin_layout");
    });

    app.get("/admin/orders", userAuth, (req, res) => {
        res.locals.content = "/api/orders/table";
        res.render("admin/admin_layout");
    });

    app.get("/admin/database", userAuth, (req, res) => {
        res.locals.content = "/api/database";
        res.render("admin/admin_layout");
    });
}