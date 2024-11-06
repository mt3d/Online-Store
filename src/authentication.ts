import { Express } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { getConfig, getSecret } from "./config";
import { Customer } from "./data/customer_models";
import { customer_repository } from "./data";

const clientID = getSecret("GOOGLE_CLIENT_ID");
const clientSecret = getSecret("GOOGLE_CLIENT_SECRET");
const callbackURL: string = getConfig("auth:openauth:redirectionUrl");
const authCallbackURL: string = getConfig("admin:openauth:redirectionUrl");

declare global {
    namespace Express {
        // This user object is added to authenticated requests by Passport.
        interface User extends Customer {
            adminUser?: boolean;
        }
    }
}

export const createAuthentication = (app: Express) => {
    passport.use("admin-auth", new GoogleStrategy(
        {
        clientID,
        clientSecret,
        callbackURL: authCallbackURL,
        scope: ["email", "profile"],
        state: true
        },
        (accessToken: string, refreshToken: string, profile: Profile, callback: VerifyCallback) => {
            return callback(null, {
                name: profile.displayName,
                email: profile.emails?.[0].value ?? "",
                federatedId: profile.id,
                adminUser: true
            });
        }
    ));

    passport.use(new GoogleStrategy(
        {
            clientID,
            clientSecret,
            callbackURL,
            scope: ["email", "profile"],
            state: true
        },
        async (accessToken: string, refreshToken: string, profile: Profile, callback: VerifyCallback) => {
            /**
             * The callback function receives an access token, which can be used to make
             * API queries, and a refresh token, which can be used to obtain a new access token.
             * 
             * The last parameter is invoked once the user's data is ready.
             */
            const emailAddr = profile.emails?.[0].value ?? "";
            const customer = await customer_repository.storeCustomer({
                name: profile.displayName,
                email: emailAddr,
                federatedId: profile.id
            });

            const { id, name, email } = customer;
            return callback(null, { id, name, email });
        }
    ));

    // Serialize the user data into a session.
    passport.serializeUser((user, callback) => {
        /**
         * There is no persistent data store for administration user details, so the
         * serializeUser and deserializeUser functions have been modified
         * to serialize the entire User object in the session, but only when the
         * adminUser property is true .
         */
        callback(null, user.adminUser ? JSON.stringify(user) : user.id);
    });

    passport.deserializeUser((id: number | string, callbackFunc) => {
        if (typeof id == "string") {
            callbackFunc(null, JSON.parse(id));
        } else {
            customer_repository.getCustomer(id).then(user => {
                callbackFunc(null, user);
            });
        }
    });

    /**
     * The passport.session function returns a middleware function that will
     * authenticate requests using the data stored in a session from other
     * authentication mechanisms, and it has the effect of deserializing the user for
     * requests when they have been authenticated using the Google OAuth service
     */
    app.use(passport.session());
}