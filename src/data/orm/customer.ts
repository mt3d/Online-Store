import { Customer } from "../customer_models";
import { CustomerRepository } from "../customer_repository";
import { Address } from "../order_models";
import { BaseRepo, Constructor } from "./core";
import { CustomerModel } from "./models/customer_models";
import { AddressModel, OrderModel } from "./models/order_models";

export function AddCustomers<TBase extends Constructor<BaseRepo>>(Base: TBase) {
    return class extends Base implements CustomerRepository {
        getCustomer(id: number): Promise<Customer | null> {
            return CustomerModel.findByPk(id, { raw: true });
        }

        getCustomerByFederatedId(id: string): Promise<Customer | null> {
            return CustomerModel.findOne({
                where: { federatedId: id },
                raw: true
            });
        }

        getCustomerAddress(id: number): Promise<Address | null> {
            // Find the customer's earlier orders, and then obtain the address data associated with them.
            return AddressModel.findOne({
                include: [{
                    model: OrderModel,
                    where: { customerId: id },
                    attributes: [] // exclude the order data from the response
                }],
                order: [["updatedAt", "DESC"]]
            })
        }

        async storeCustomer(customer: Customer): Promise<Customer> {
            const [data, created] = await CustomerModel.findOrCreate({
                where: { email: customer.email },
                defaults: customer
            });

            // If not created, update the current one.
            if (!created) {
                data.name = customer.name;
                data.email = customer.email;
                data.federatedId = customer.federatedId;

                await data.save();
            }

            return data;
        }
    }
}