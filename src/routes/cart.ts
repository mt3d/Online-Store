import { addLine, Cart, createCart, removeLine } from "../data/cart_model";
import { Express } from "express";
import * as cart_helpers from "../data/cart_helpers";
import querystring from "node:querystring";

// SessionData is the type used to represent session data by "express-session";
declare module "express-session" {
    interface SessionData {
        cart?: Cart;
    }
}

export const createCartMiddleware = (app: Express) => {
    app.use((req, res, next) => {
        res.locals.cart = req.session.cart = req.session.cart ?? createCart();
        next();
    });
}

export const createCartRoutes = (app: Express) => {
    // Add a product to the user's cart.
    app.post("/cart", (req, res) => {
        const productId = Number.parseInt(req.body.productId);
        if (isNaN(productId)) {
            throw new Error("ID must be an integer");
        }

        addLine(req.session.cart as Cart, productId, 1);

        res.redirect(`/cart?returnUrl=${querystring.escape(req.body.returnUrl ?? "/")}`);
    });

    app.get("/cart", async (req, res) => {
        const cart = req.session.cart as Cart;
        res.render("cart", {
            cart: await cart_helpers.getCartDetail(cart),
            returnUrl: querystring.unescape(req.query.returnUrl?.toString() ?? "/")
        });
    });

    // Most browsers allow HTML forms to send only `GET` and `POST` requests.
    app.post("/cart/remove", (req, res) => {
        const id = Number.parseInt(req.body.id);
        if (!isNaN(id)) {
            removeLine(req.session.cart as Cart, id);
        }

        res.redirect(`/cart?returnUrl=${querystring.escape(req.body.returnUrl ?? "/")}`)
    });
}