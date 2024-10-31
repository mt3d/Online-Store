import validator from "validator";
import { ValidationStatus } from "./validation_types";

export const minLength = (min: number) => (status: ValidationStatus) => {
    if (!validator.isLength(status.value, { min })) {
        status.setInvalid(true);
        status.messages.push(`Enter at least ${min} characters`);
    }
};

export const email = (status: ValidationStatus) => {
    if (!validator.isEmail(status.value)) {
        status.setInvalid(true);
        status.messages.push("Enter an email address");
    }
};

export const required = (status: ValidationStatus) => {
    if (validator.isEmpty(status.value.toString(), { ignore_whitespace: true })) {
        status.setInvalid(true);
        status.messages.push("A value is required");
    }
}

/**
 * This function is a consequence of requiring validation rules for every
 * property defined by a model class except the `id` property.
 */
export const no_op = (status: ValidationStatus) => { /** Do nothing */ }