import { Express } from "express";
import { AddressValidator, CustomerValidator, getData, isValid, ValidationResults } from "../data/validation";
import { Customer } from "../data/customer_models";
import { Address } from "../data/order_models";
import { createAndStoreOrder } from "./order_helpers";
import passport from "passport";
import { customer_repository } from "../data";

declare module "express-session" {
    interface SessionData {
        orderData?: {
            customer?: ValidationResults<Customer>,
            address?: ValidationResults<Address>
        };
        pageSize?: string;
    }
}
export const createOrderRoutes = (app: Express) => {
    app.get("/checkout/google", passport.authenticate("google"));

    /**
     * This route handles the redirection back from Google when the authentication
     * process is complete.
     * 
     * The authentication strategy will process the data sent by Google to
     * authenticate the user and, if authentication has been successful, perform a
     * redirection to the /checkout URL. 
     */
    app.get("/signin-google", passport.authenticate("google", { successRedirect: "/checkout", keepSessionInfo: true }));

    app.get("/checkout", async (req, res) => {
        if (!req.session.orderData && req.user) {
            req.session.orderData = {
                customer: await CustomerValidator.validate(req.user),
                address: await AddressValidator.validate(await customer_repository.getCustomerAddress(req.user?.id ?? 0) ?? {})
            }
        }

        req.session.pageSize = req.session.pageSize ?? req.query.pageSize?.toString() ?? "3";

        /**
         * This template renders the HTML form, which will be empty the first time the
         * user sends a GET request because no customer or address data has been
         * stored in the session.
         */
        res.render("order_details", {
            order: req.session.orderData,
            page: 1,
            pageSize: req.session.pageSize
        });
    });

    app.post("/checkout", async (req, res) => {
        const { customer, address } = req.body;
        const data = req.session.orderData = {
            customer: await CustomerValidator.validate(customer),
            address: await AddressValidator.validate(address)
        };

        if (isValid(data.customer) && isValid(data.address) && req.session.cart) {
            // By using getData we ensure that only the properties defined by the model types are used.
            const order = await createAndStoreOrder(getData(data.customer), getData(data.address), req.session.cart);
            res.redirect(`/checkout/${order.id}`);
            req.session.cart = undefined;
            req.session.orderData = undefined;
        } else {
            res.redirect("/checkout");
        }
    });

    app.get("/checkout/:id", (req, res) => {
        res.render("order_complete", { id: req.params.id, pageSize: req.session.pageSize ?? 3 });
    });
}