const configuredApiUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL;

export const BASE_URL = configuredApiUrl
    ? `${configuredApiUrl.replace(/\/+$/, "")}/api/v1`
    : "/api/v1";
