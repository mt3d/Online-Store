import { Op } from "sequelize";
import { ProductQueryParameters } from "../catalog_models";
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
        async getProducts(params?: ProductQueryParameters) {
            const opts: any = {};
            
            if (params?.page && params.pageSize) {
                opts.limit = params?.pageSize;

                // offset: Skip the first n items of the results.
                opts.offset = (params.page - 1) * params.pageSize
            }

            if (params?.searchTerm) {
                // The percentage sign is used to represent 0, 1 or any unknown sequence of characters.
                const searchOp = {
                    [Op.like]: "%" + params.searchTerm + "%"
                };

                opts.where = {
                    [Op.or]: { name: searchOp, description: searchOp }
                };
            }

            if (params?.category) {
                opts.where = {
                    ...opts.where, categoryId: params.category
                }
            }

            /**
             * The objects created by Sequelize cannot be used directly with Handlebars,
             * since their values are presented in a way that allows for changes to be tracked.
             * The `raw` option tells Sequelize not to process the data it receives, which
             * means that simple data objects are created.
             * 
             * The `nest` option ensures that nested values, such as those produced for
             * associated data, are presented as nested data objects.
             * 
             * The findAndCountAll method is a convenience method that combines findAll and count.
             * This is useful when dealing with queries related to pagination where you want
             * to retrieve data with a limit and offset but also need to know the total number
             * of records that match the query.
             */
            const result = await ProductModel.findAndCountAll({
                include: [
                    { model: SupplierModel, as: "supplier" },
                    { model: CategoryModel, as: "category" },
                ],
                raw: true,
                nest: true,
                ...opts
            });

            // Will be used when designing category-based filtering controls.
            const categories = await this.getCategories();

            return { products: result.rows, totalCount: result.count, categories }
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