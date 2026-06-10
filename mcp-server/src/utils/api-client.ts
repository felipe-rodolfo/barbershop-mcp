import "dotenv/config";

const LARAVEL_API_BASE_URL = process.env.LARAVEL_API_BASE_URL || "http://localhost:8000/api/v1";

export async function callLaravelAPI(endpoint: string, options?: RequestInit) {
    const url = `${LARAVEL_API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            ...options,
        });

        if(!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch(error) {
        console.error(`Error calling ${url}:`, error);
        throw error;
    }
}