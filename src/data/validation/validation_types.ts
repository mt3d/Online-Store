
/**
 * Represents the validation status of a single model property.
 * Note that a read-only version of the value is stored too.
 */
export class ValidationStatus {
    private invalid: boolean = false;

    constructor(public readonly value: any) {}

    get isInvalid(): boolean {
        return this.invalid;
    }

    setInvalid(newValue: boolean) {
        // Once a value has been marked as invalid, it cannot be returned to the valid state.
        // true = invalid (false) || invalid (true)
        this.invalid = newValue || this.invalid;
    }

    messages: string[] = [];
}

/* *
 * Describes a rule that receives a `ValidationStatus` object and validates
 * the data value it defines.
 * 
 * Simply speaking, a rule is a function that takes a status, and then edit this status.
 */
export type ValidationRule = (status: ValidationStatus) => void | Promise<void>;

/**
 * Describes the set of rules that are applied to a model class, T.
 */
export type ValidationRuleSet<T> = {
    /**
     * he keyof operator takes an object type and produces a string or
     * numeric literal union of its keys.
     * 
     * type Point = { x: number; y: number }
     * keyof Point is "x" | "y"
     * 
     * Omit<Type, Keys>
     * Constructs a type by picking all properties from Type and then removing
     * Keys (string literal or union of string literals).
     * 
     * Required<Type>
     * Constructs a type consisting of all properties of Type set to required.
     * 
     * In effect, properties are required for each required property defined by T, excluding "id".
     */
    [key in keyof Omit<Required<T>, "id">]: ValidationRule | ValidationRule[];
}

export type ValidationResults<T> = {
    [key in keyof Omit<Required<T>, "id">]: ValidationStatus;
}