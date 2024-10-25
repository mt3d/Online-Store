/**Objects read from multiple configuration files can be merged to create
 * the overall configuration, however, JavaScript doesn't have integrated support
 * for merging objects.
 */

/**Don't confuse merging with flattening. */
export const merge = (target: any, source: any): any => {
    Object.keys(source).forEach(key => {
        // Handle nested objects correctly.

        if (typeof source[key] === "object" && !Array.isArray(source[key])) {
            /** The algorithm:
             * If the target has the same property object (let's say "compiler"),
             * run the merge recursively.
             * 
             * If it does not have the object as a property, then use Object.assign (which
             * performs shallow coping).*/

            if (Object.hasOwn(target, key)) {
                merge(target[key], source[key]);
            } else { 
                Object.assign(target, source[key]);
            }
        } else {
            target[key] = source[key];
        }
    });
}