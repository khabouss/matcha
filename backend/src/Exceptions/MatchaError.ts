class MatchaError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number = 500) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, MatchaError.prototype);
    }
}
export default MatchaError;
