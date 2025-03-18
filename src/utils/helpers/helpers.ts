import { HttpClient } from "@/api/services/HttpClient";

// 🟢 Get Cookie
export const getCookie = (cname: string): string => {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cname}=`))
        ?.split("=")[1]
        ?.trim() || "";
    
    console.log(`Getting cookie ${cname}:`, !!cookieValue);
    return cookieValue;
};

// 🟢 Set Cookie
export const setCookie = (cname: string, cvalue: string, exdays: number = 30): void => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    const cookieString = `${cname}=${cvalue};${expires};path=/;SameSite=Lax`;
    document.cookie = cookieString;
    console.log(`Setting cookie ${cname}:`, cookieString);
};

// 🟢 Delete Cookie
export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    console.log(`Deleted cookie ${name}`);
};

// 🟢 Logout User
export const handleLogout = (): void => {
    // Clear all authentication-related cookies
    deleteCookie("customerToken");
    deleteCookie("agent_email");
    deleteCookie("workspaceId");
    
    // Reset HTTP client configuration
    HttpClient.apiClient.defaults.headers.common["Authorization"] = "";
    
    // Force clear browser storage too
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    
    console.log("User logged out");
    
    // Don't use router here, use direct navigation for reliability
    setTimeout(() => {
        window.location.href = "/sign-in";
    }, 100);
};

// 🟢 Set Auth Token
export const handleSetToken = (token: string): boolean => {
    // Check if token is valid
    if (!token) {
        console.error("Cannot set empty token");
        return false;
    }
    
    try {
        // Set the cookie with a long expiration (30 days)
        setCookie("customerToken", token, 30);
        
        // Also store in localStorage as backup
        localStorage.setItem("token", token);
        
        // Configure axios with the new token
        HttpClient.apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        HttpClient.setAxiosDefaultConfig();
        
        console.log("Token set successfully:", !!token);
        return true;
    } catch (error) {
        console.error("Error setting token:", error);
        return false;
    }
};

// 🟢 Workspace ID Management
export const setWorkspaceId = (id: string): void => {
    setCookie("workspaceId", id);
};

export const getWorkspaceId = (): string => {
    return getCookie("workspaceId");
};

// 🟢 Debounce Function with Immediate Execution
export const debounceWithImmediate = <T>(
    func: (props: T) => void,
    immediateFunc: (props: T) => void,
    delay: number
): ((props: T) => void) => {
    let timeoutId: NodeJS.Timeout;
    let immediateCall = true;
    return (props: T) => {
        clearTimeout(timeoutId);
        if (immediateCall) {
            immediateFunc(props);
            immediateCall = false;
        }
        timeoutId = setTimeout(() => {
            immediateCall = true;
            func(props);
        }, delay);
    };
};

// 🟢 Convert Array to Query String
interface QueryObject {
    type: string;
    data: string | number;
}

export const arrayToQueryString = (objArray: QueryObject[]): string => {
    return objArray
        .map((obj) => `${encodeURIComponent(obj.type)}=${encodeURIComponent(obj.data)}`)
        .join("&");
};

// 🟢 Email Validator
export const isEmail = (email: string): boolean => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

// 🟢 URL Validator
export const isValidHttpUrl = (str: string): boolean => {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
};

// 🟢 Extract Name from URL
export const getNameFromUrl = (url: string): string => {
    const regex = /[http,https]:\/\/(.+?)\./;
    const match = url.match(regex);
    return match ? match[1] : "";
};

// 🟢 Throttle Function
export const throttle = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    return function (...args: Parameters<T>) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            func(...args);
            lastCall = now;
        }
    };
};

// 🟢 Base64 Encode & Decode
export const encryptBase64 = (text: string): string => btoa(text);
export const decryptBase64 = (encryptText: string): string => {
    try {
        return atob(encryptText);
    } catch {
        return "";
    }
};

// 🟢 Convert Text to Delta
export const convertTextToDelta = (text: string): { insert: string }[] => {
    return [{ insert: text }];
};

// 🟢 Convert Delta to Plain Text
interface DeltaOperation {
    insert: string | { mention?: { value: string } };
}

export const convertDeltaToPlainText = (ops: DeltaOperation[]): string => {
    return ops.map((op) => (typeof op.insert === "string" ? op.insert : op.insert.mention?.value || "")).join("");
};

// 🟢 Convert Delta to Text
export const convertDeltaToText = (delta?: { ops: DeltaOperation[] }): string => {
    if (!delta) return "";
    return convertDeltaToPlainText(delta.ops);
};

// 🟢 Replace `mustache` Templating with Native JavaScript
export const variabledText = (plainText: string, data: Record<string, any>): string => {
    return plainText.replace(/\{\{(.*?)\}\}/g, (_, key) => {
        const keys = key.trim().split(".");
        let value: any = data;
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) return "";
        }
        return String(value);
    });
};

// 🟢 Role Checks
export const isOrganizationAdmin = (): boolean => localStorage.getItem("role") === "ORGANIZATION_ADMIN";
export const isWorkspaceAdmin = (): boolean => localStorage.getItem("role") === "WORKSPACE_ADMIN";
export const isWorkspaceAgent = (): boolean => localStorage.getItem("role") === "WORKSPACE_AGENT";

// 🟢 Get User ID
export const getUserId = (): string | null => localStorage.getItem("userId");
