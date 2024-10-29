import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";

export class CustomerModel extends Model<InferAttributes<CustomerModel>, InferCreationAttributes<CustomerModel>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare email: string;
}