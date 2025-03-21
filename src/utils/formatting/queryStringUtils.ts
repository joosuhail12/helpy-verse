
/**
 * Query string formatting utility functions
 */

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
