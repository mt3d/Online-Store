import { BaseRepo, Constructor } from "./core";
import { CategoryModel, ProductModel, SupplierModel } from "./models";

/**
 * AddQueries is a mixing. It accepts a base class and returns a new class
 * that adds the three methods.
 * 
 * The result combines the features defined by the base class, plus the new methods.
 * 
 * We let TypeScript infer AddQueries return type, which is the intersection
 * of TBase and our new anonymous class.
 * 
 * Instead of accepting any class, we use a generic constructor to make sure
 * the class passed is a BaseRepo.
 * 
 * You can apply as many mixins to a class as you want to yield a class with
 * richer and richer behavior, all in a typesafe way.
 */
export function AddQueries<TBase extends Constructor<BaseRepo>>(Base: TBase) {
    return class extends Base {
        getProducts() {
            /**
             * The objects created by Sequelize cannot be used directly with Handlebars,
             * since their values are presented in a way that allows for changes to be tracked.
             * The `raw` option tells Sequelize not to process the data it receives, which
             * means that simple data objects are created.
             * 
             * The `nest` option ensures that nested values, such as those produced for
             * associated data, are presented as nested data objects.
             */
            return ProductModel.findAll({
                include: [
                    { model: SupplierModel, as: "supplier" },
                    { model: CategoryModel, as: "category" },
                ],
                raw: true,
                nest: true
            });
        }

        getCategories() {
            return CategoryModel.findAll({
                raw: true,
                nest: true
            });
        }

        getSuppliers() {
            return SupplierModel.findAll({
                raw: true,
                nest: true
            });
        }
    }
}