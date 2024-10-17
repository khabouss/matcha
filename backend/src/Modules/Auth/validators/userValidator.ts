
// Validation function that returns an error message or null
export const validateUserSignup = (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const { email, password, userName, firstName, lastName } = data;

    // Simple validation rules
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        errors.push('Invalid email.');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        errors.push('Password must be at least 6 characters long.');
    }

    if (!userName || typeof userName !== 'string') {
        errors.push('Username is required.');
    }

    if (!firstName || typeof firstName !== 'string') {
        errors.push('First name is required.');
    }

    if (!lastName || typeof lastName !== 'string') {
        errors.push('Last name is required.');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};