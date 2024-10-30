import { CatalogRepository } from "./catalog_repository";
import { OrderRepository } from "./oreder_repository";
import { CatalogRepoImpl } from "./orm";

// The TypeScript compiler can determine that the combination of methods conform to the interface.

const repo = new CatalogRepoImpl();

export const catalog_repository: CatalogRepository = repo;
export const order_repository: OrderRepository = repo;