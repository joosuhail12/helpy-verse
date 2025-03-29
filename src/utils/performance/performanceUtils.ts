
/**
 * Performance utility functions like debounce and throttle
 */

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
