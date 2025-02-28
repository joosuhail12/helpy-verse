
/**
 * Encoding and data transformation utility functions
 */

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
