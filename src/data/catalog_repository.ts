import { Category, Product, ProductQueryParameters, ProductQueryResult, Supplier } from "./catalog_models";

export interface CatalogRepository {
    getProducts(params?: ProductQueryParameters): Promise<ProductQueryResult>;
    storeProduct(p: Product): Promise<Product>;

    getCategories(): Promise<Category[]>;
    storeCategory(c: Category): Promise<Category>;

    getSuppliers(): Promise<Supplier[]>;
    storeSupplier(s: Supplier): Promise<Supplier>;
}