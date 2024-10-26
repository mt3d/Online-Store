import { DataTypes, Sequelize } from "sequelize";
import { CategoryModel, ProductModel, SupplierModel } from "./catalog_models";

const primaryKey = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}

export const initializeCatalogModels = (sequelize: Sequelize) => {
    ProductModel.init({
        ...primaryKey,
        name: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        price: { type: DataTypes.DECIMAL(10, 2) }
    }, { sequelize });

    CategoryModel.init({
        ...primaryKey,
        name: { type: DataTypes.STRING }
    }, { sequelize });

    SupplierModel.init({
        ...primaryKey,
        name: { type: DataTypes.STRING }
    }, { sequelize });

    /**
     * A One-To-One relationship exists between ProductModel and CategoryModel,
     * with the foreign being defined in the target model CategoryModel.
     * 
     * Override the default names used for the foreign key and association properties.
     * 
     * as: The alias of this model, in singular form. It defaults to the singularized
     * name of the target (i.e. categorymodel in our case), hence the change.
     */
    ProductModel.belongsTo(CategoryModel, { foreignKey: "categoryId", as: "category" });

    ProductModel.belongsTo(SupplierModel, { foreignKey: "supplierId", as: "supplier" });

    CategoryModel.hasMany(ProductModel, { foreignKey: "categoryId", as: "products" });

    SupplierModel.hasMany(ProductModel, { foreignKey: "supplierId", as: "products" });
}