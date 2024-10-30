import { Order } from "../order_models";
import { BaseRepo, Constructor } from "./core";
import { CustomerModel } from "./models/customer_models";
import { AddressModel, OrderModel, ProductSelectionModel } from "./models/order_models";

export function AddOrderStorage<TBase extends Constructor<BaseRepo>>(Base: TBase) {
    return class extends Base {
        storeOrder(order: Order): Promise<Order> {
            return this.sequelize.transaction(async (transaction) => {
                const { id, shipped } = order;
                const [stored] = await OrderModel.upsert({ id, shipped }, { transaction });
                
                if (order.customer) {
                    const [{id}] = await CustomerModel.findOrCreate({
                        where: { email: order.customer.email },
                        defaults: order.customer, // Default values to use if building a new instance.
                        transaction
                    });
                    stored.customerId = id;
                }

                if (order.address) {
                    const [{id}] = await AddressModel.findOrCreate({
                        where: { ...order.address },
                        defaults: order.address,
                        transaction
                    });
                    stored.addressId = id;
                }

                await stored.save({ transaction });

                if (order.selections) {
                    const sels = await ProductSelectionModel.bulkCreate(order.selections, { transaction });
                    await stored.setSelections(sels, { transaction });
                }

                return stored;
            })
        }
    }
}