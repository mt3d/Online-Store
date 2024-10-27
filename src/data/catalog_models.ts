
export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    category?: Category;
    supplier?: Supplier;
}

export interface Category {
    id?: number;
    name: string;
    products?: Product[];
}

export interface Supplier {
    id?: number;
    name: string;
    products?: Product[];
}

/**
 * Allows the pagination requirements associated with a query to be provided to the repository.
 * Could be expanded as other data navigation features are added.
 */
export interface ProductQueryParameters {
    pageSize?: number;
    page?: number;
    category?: number;
    searchTerm?: string;
}

export interface ProductQueryResult {
    products: Product[];
    totalCount: number;
    categories: Category[];
}