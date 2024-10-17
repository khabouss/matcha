type ValidationResult = {
    valid: boolean;
    errors: string[];
};

class Validator {
    private value: any;
    private errors: string[] = [];
    private isOptional: boolean = false;

    constructor(value: any) {
        this.value = value;
    }

    public static create(value: any) {
        return new Validator(value);
    }

    public email(): this {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
            !this.isOptional &&
            (!this.value ||
                typeof this.value !== 'string' ||
                !emailRegex.test(this.value))
        ) {
            this.errors.push('Invalid email.');
        }
        return this;
    }

    public string(): this {
        if (!this.isOptional && typeof this.value !== 'string') {
            this.errors.push('Value must be a string.');
        }
        return this;
    }

    public optional(): this {
        this.isOptional = true;
        return this;
    }

    public validate(): ValidationResult {
        return {
            valid: this.errors.length === 0,
            errors: this.errors,
        };
    }
}
