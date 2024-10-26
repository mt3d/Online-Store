import { Sequelize } from "sequelize";
import { getConfig } from "../../config";
import { CategoryModel, initializeModels, ProductModel, SupplierModel } from "./models";
import { readFileSync } from "node:fs";

const config = getConfig("catalog:orm_repo");
const logging = config.logging ? { logging: console.log, logQueryParameters: true } : { logging: false }; 

export class BaseRepo {
    sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize({
            ...config.settings,
            ...logging,
        });

        this.initModelsAndDatabase();
    }

    async initModelsAndDatabase(): Promise<void> {
        initializeModels(this.sequelize);

        if (config.reset_db) {
            await this.sequelize.drop();
            await this.sequelize.sync();
            await this.addSeedData();
        } else {
            await this.sequelize.sync();
        }
    }

    async addSeedData() {
        const data = JSON.parse(readFileSync(config.seed_file).toString());

        await this.sequelize.transaction(async (transaction) => {
            await SupplierModel.bulkCreate(data.suppliers, { transaction });
            await CategoryModel.bulkCreate(data.categories, { transaction });
            await ProductModel.bulkCreate(data.products, { transaction });
        });
    }
}

/**
 * A type that is used to create the `mixin` and represents
 * a type that can be instantiated with the `new` keyword.
 * 
 * A class constructor. This type represents any constructor.
 * The constructor is any thing that can be new-ed
 */
export type Constructor<T = {}> = new (...args: any[]) => T;