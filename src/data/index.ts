import { CatalogRepository } from "./catalog_repository";
import { CatalogRepoImpl } from "./orm";

// The TypeScript compiler can determine that the combination of methods conform to the interface.
export const catalog_repository: CatalogRepository = new CatalogRepoImpl();