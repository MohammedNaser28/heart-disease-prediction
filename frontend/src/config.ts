// Base URL for all backend API calls.
// On Render: VITE_API_URL is injected at build time via environment variable.
// Locally: falls back to empty string so relative URLs still work.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

export default API_BASE_URL;
