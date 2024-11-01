import { Customer } from "./customer_models";
import { Address } from "./order_models";

export interface CustomerRepository {
    // Search using the unique id created by the database server.
    getCustomer(id: number): Promise<Customer | null>;
    getCustomerByFederatedId(id: string): Promise<Customer | null>;

    /**
     * There won't be an address until an order has been placed, but the data
     * that is stored will be available for the second and subsequent orders
     * the customer create.
     */
    getCustomerAddress(id: number): Promise<Address | null>;
    storeCustomer(customer: Customer): Promise<Customer>;
}