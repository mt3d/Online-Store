import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";

/**
 * Using JavaScript, Models can be defined in two equivalent ways in Sequelize:
 *  1) Calling sequelize.define(modelName, attributes, options)
 *  2) Extending Model and calling init(attributes, options)
 * 
 * When using TypeScript, adding a Public Class Field with the same name
 * as one of the model's attribute is going to cause issues. Sequelize adds
 * a getter & a setter for each attribute defined through Model.init.
 * Adding a Public Class Field will shadow those getter and setters,
 * blocking access to the model's actual data.
 * 
 * So, how do we add typing information without adding an actual public class field?
 * We use the `declare` keyword.
 * 
 * InferAttributes and InferCreationAttributes will extract Attribute typings
 * directly from the Model. InferCreationAttributes works like InferAttributes,
 * but fields that are tagged using CreationOptional will be optional.
 * See https://sequelize.org/docs/v6/other-topics/typescript/ for more details.
 */
export class ProductModel extends Model<InferAttributes<ProductModel>, InferCreationAttributes<ProductModel>> {
    declare id?: CreationOptional<number>;
    declare name: string;
    declare description: string;
    declare price: number;
    declare categoryId: ForeignKey<CategoryModel["id"]>;
    declare supplierId: ForeignKey<SupplierModel["id"]>;

    declare category?: InferAttributes<CategoryModel>;
    declare supplier?: InferAttributes<SupplierModel>;
}

export class CategoryModel extends Model<InferAttributes<CategoryModel>, InferCreationAttributes<CategoryModel>> {
    declare id?: CreationOptional<number>;
    declare name: string;

    declare products?: InferAttributes<ProductModel>[];
}

export class SupplierModel extends Model<InferAttributes<SupplierModel>, InferCreationAttributes<SupplierModel>> {
    declare id?: CreationOptional<number>;
    declare name: string;

    declare products?: InferAttributes<ProductModel>[];
}