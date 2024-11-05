import 'dotenv/config';

export function getEnvVar(arg: string): string {
    const argVal = process.env[arg];

    if (!argVal) {
        throw new Error(`Environment variable "${arg} not set`);
    }

    return argVal;
}
