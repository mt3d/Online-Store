import { CreationOptional, ForeignKey, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { CustomerModel } from "./customer_models";
import { Address, Order, ProductSelection } from "../../order_models";
import { ProductModel } from "./catalog_models";

export class OrderModel extends Model<InferAttributes<OrderModel>, InferCreationAttributes<OrderModel>> implements Order {
    declare id?: CreationOptional<number>;
    declare shipped: boolean;
    declare customerId: ForeignKey<CustomerModel["id"]>;
    declare customer?: InferCreationAttributes<CustomerModel>;
    declare addressId: ForeignKey<AddressModel["id"]>;
    declare address?: InferAttributes<AddressModel>;
    declare selections?: InferAttributes<ProductSelectionModel>[];

    // This is the only method added by sequelize that we need.
    declare setSelections: HasManySetAssociationsMixin<ProductSelection, number>;
}

export class ProductSelectionModel extends Model<InferAttributes<ProductSelectionModel>, InferCreationAttributes<ProductSelectionModel>> implements ProductSelection {
    declare id?: CreationOptional<number>;
    declare productId?: ForeignKey<ProductModel["id"]>;
    declare product?: InferCreationAttributes<ProductModel>;
    declare quantity: number;
    declare price: number;
    declare orderId: ForeignKey<OrderModel["id"]>;
    declare order?: InferCreationAttributes<OrderModel>;
}

export class AddressModel extends Model<InferAttributes<AddressModel>, InferCreationAttributes<AddressModel>> implements Address {
    declare id?: CreationOptional<number>;
    declare street: string;
    declare city: string;
    declare state: string;
    declare zip: string;
}