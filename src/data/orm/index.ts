import { CatalogRepository } from "../catalog_repository";
import { BaseRepo } from "./core";
import { AddOrderQueries } from "./order_queries";
import { AddOrderStorage } from "./order_storage";
import { AddQueries } from "./queries";
import { AddStorage } from "./storage";

const CatalogRepo = AddStorage(AddQueries(BaseRepo));
const RepoWithOrders = AddOrderStorage(AddOrderQueries(CatalogRepo));

export const CatalogRepoImpl = RepoWithOrders;