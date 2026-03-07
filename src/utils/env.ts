const getEnvVar = (value: string | undefined, key: string): string => {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const API_URL = getEnvVar(import.meta.env.VITE_API_URL, "VITE_API_URL");
export const SOCKET_URL = getEnvVar(import.meta.env.VITE_SOCKET_URL, "VITE_SOCKET_URL");