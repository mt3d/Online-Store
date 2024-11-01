import { Customer } from "../customer_models";
import { Address } from "../order_models";
import { email, minLength, no_op, required } from "./basic_rules";
import { Validator } from "./validator";

export const CustomerValidator = new Validator<Customer>({
    name: [required, minLength(6)],
    email: email,
    federatedId: no_op
});

export const AddressValidator = new Validator<Address>({
    street: required,
    city: required,
    state: required,
    zip: no_op
})