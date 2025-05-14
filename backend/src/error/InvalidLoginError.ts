export class InvalidLoginError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Invalid Login Error';
        Object.setPrototypeOf(this, InvalidLoginError.prototype);
    }
}
