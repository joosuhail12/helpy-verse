import { getWorkspaceId, handleLogout, getCookie, getClientIdFromCookie } from "@/utils/helpers/helpers";
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { get } from "lodash";

const API_BASE_URL = 'http://localhost:4000/api';
// const API_BASE_URL = 'https://dev-socket.pullseai.com/api';

// const LLM_SERVICE_URL = 'http://localhost:4000/api';
const LLM_SERVICE_URL = 'https://dev-socket.pullseai.com/api';

export const setAxiosDefaultConfig = (): void => {
    axios.defaults.baseURL = API_BASE_URL;

    const token = getCookie("customerToken");

    axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
    axios.defaults.headers.post["Content-Type"] = "application/json";
};
// ✅ Initialize Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Request Interceptor - Adds Token & Workspace ID
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getCookie("customerToken");
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    // ✅ Ensure config.url exists before modifying it
    if (config.url) {
        const separator = config.url.includes("?") ? "&" : "?";
        config.url += `${separator}workspace_id=${getWorkspaceId()}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});



// ✅ Response Interceptor - Handles Unauthorized Errors
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        const errorResponse = get(error, "response.data.code", "");

        if (errorResponse === "UNAUTHORIZED") {
            handleLogout();
        }

        return Promise.reject(error);
    }
);

// ✅ LLM Service Instance
const llmService = axios.create({
    baseURL: LLM_SERVICE_URL,
    headers: { "Content-Type": "application/json" },
});

// ✅ API Call Wrapper
export const HttpClient = {
    apiClient, // Standard API client
    llmService, // LLM-specific instance
    setAxiosDefaultConfig,
};

