import { HelperOptions } from "handlebars";
import { stringify } from "node:querystring";
import { Category } from "../data/catalog_models";

const getData = (options: HelperOptions) => {
    /**
     * HelperOptions.hash is used to receive data in name/value pairs
     * and it is useful to provide structured data to a helper.
     * 
     * A Hash is a dictionary-like collection of unique keys and their values.
     * 
     * HelperOptions.data provides access to the context data, and `root`
     * containts the data from the template that invoked the helper.
     */
    return { ...options.data.root, ...options.hash }
}

export const navigationUrl = (options: HelperOptions) => {
    const { page, pageSize, category, searchTerm } = getData(options);
    return "/?" + stringify({ page, pageSize, category, searchTerm });
}

export const escapeUrl = (url: string) => escape(url);

/**
 * Repeatedly generate a section of content for each page of content,
 * using the pagination data provided to the template
 * 
 * Generates blocks of content. This is done using the function
 * assigned to `HelperOptions.fn`, which generates content using
 * the elements contained between the helper tags.
 * 
 * The content contained between the helper tags (i.e. {{#pageButtons}})
 * will be duplicated for each available page of data.
 */
export const pageButtons = (options: HelperOptions) => {
    const { page, pageCount } = getData(options);
    let output = "";

    // Create content for each data page.
    for (let i = 1; i <= pageCount; i++) {
         /**
         * Each call for `fn` will add everything between the helpers tags
         * using the context provided to it.
         * 
         * This options hash contains a function (options.fn) that behaves like
         * a normal compiled Handlebars template. Specifically, the function
         * will take a context and return a String.
         * 
         * Supplement the shared pagination data with `index` and `selected`.
         */
        output += options.fn({
            page,
            pageCount,
            index: i,
            selected: i === page
        });
    }

    return output;
}

export const pageSizeOptions = (options: HelperOptions) => {
    const { pageSize } = getData(options);
    let output = "";
    [3, 6, 9].forEach(size => {
        output += options.fn({
            size,
            selected: pageSize === size ? "selected" : ""
        });
    });

    return output;
}

export const categoryButtons = (options: HelperOptions) => {
    const { category, categories } = getData(options);

    let output = "";

    (categories as Category[]).forEach(cat => {
            output += options.fn({
                id: cat.id,
                name: cat.name,
                selected: cat.id === category
            });
        }
    );

    return output;
}