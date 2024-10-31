import { ValidationResults, ValidationRule, ValidationRuleSet, ValidationStatus } from "./validation_types";

/**
 * Provides validation for the model type T.
 */
export class Validator<T> {
    /**
     * 
     * @param rules The rules to apply.
     * @param breakOnInvalid specifies whether validation for a property
     * will stop after the rule reports whether a value is invalid, or
     * whether validation will continue to apply all of the rules.
     */
    constructor(public rules: ValidationRuleSet<T>, public breakOnInvalid = true) {}

    async validate(data: any): Promise<ValidationResults<T>>{
        /**
         * Map each [key, rules] into [key, status].
         * 
         * Array.map returns an array of array of results. However, since the function
         * is async, it will return an array of Promises, not results.
         */
        const vdata = Object.entries(this.rules).map(async ([key, rules]) => {
            const status = new ValidationStatus(data?.[key] ?? "");

            const rs = (Array.isArray(rules) ? rules: [rules]);

            for (const rule of rs) {
                if (!status.isInvalid || !this.breakOnInvalid) {
                    await rule(status);
                }
            }

            return [key, status];
        });

        const done = await Promise.all(vdata);
        return Object.fromEntries(done);
    }

    // validateOriginal(data: any): ValidationResults<T> {
    //     const vdata = Object.entries(this.rules).map(([key, rules]) => {
    //         const status = new ValidationStatus(data?.[key] ?? "");
    //         const rs = Array.isArray(rules) ? rules : [rules];

    //         rs.forEach(async (rule: ValidationRule) => {
    //             if (!status.isInvalid || !this.breakOnInvalid) {
    //                 await rule(status);
    //             }
    //         });

    //         return [key, status];
    //     });

    //     return Object.fromEntries(vdata);
    // }
}

/**
 * Checks the validation results produced for a value
 * and determines whether all of the properties are valid.
*/
export function isValid<T>(result: ValidationResults<T>) {
    // In a way, for each property of the type ValidationStatus in result.
    return Object.values<ValidationStatus>(result).every(r => r.isInvalid === false);
}

/**
 * Extracts the data from the validation results.
 * 
 * This will ensure that the app only uses properties for which validation ruels
 * have been defined, and values that have passed validation.
 * @param result
 * @returns 
 */
export function getData<T>(result: ValidationResults<T>): T {
    // Convert [key, status] to [key, value], then create an object from them
    // using `fromEntries`.
    return Object.fromEntries(Object.entries<ValidationStatus>(result).map(([key, status]) => [key, status.value])) as T;
}