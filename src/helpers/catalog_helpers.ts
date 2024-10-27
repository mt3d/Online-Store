import { HelperOptions } from "handlebars";
import { stringify } from "node:querystring";

const getData = (options: HelperOptions) => {
    /**
     * HelperOptions.hash is used to receive data in name/value pairs
     * and it is useful to provide structured data to a helper.
     * 
     * HelperOptions.data provides access to the context data, and `root`
     * containts the data from the template that invoked the helper.
     */
    return { ...options.data.root, ...options.hash }
}

export const navigationUrl = (options: HelperOptions) => {
    const { page, pageSize } = getData(options);
    return "/?" + stringify({ page, pageSize });
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
        // Supplement the shared pagination data with `index` and `selected`.
        /**
         * Each call for `fn` will add everything between the helpers tags
         * using the context provided to it.
         * 
         * This options hash contains a function (options.fn) that behaves like
         * a normal compiled Handlebars template. Specifically, the function
         * will take a context and return a String.
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