"use strict";
class Validator {
    constructor(value) {
        this.errors = [];
        this.isOptional = false;
        this.value = value;
    }
    static create(value) {
        return new Validator(value);
    }
    email() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.isOptional &&
            (!this.value ||
                typeof this.value !== 'string' ||
                !emailRegex.test(this.value))) {
            this.errors.push('Invalid email.');
        }
        return this;
    }
    string() {
        if (!this.isOptional && typeof this.value !== 'string') {
            this.errors.push('Value must be a string.');
        }
        return this;
    }
    optional() {
        this.isOptional = true;
        return this;
    }
    validate() {
        return {
            valid: this.errors.length === 0,
            errors: this.errors,
        };
    }
}
