
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

// 🟢 Measures execution time of a function
export const measureExecutionTime = <T extends (...args: any[]) => any>(
    func: T,
    label: string
): ((...args: Parameters<T>) => ReturnType<T>) => {
    return function (...args: Parameters<T>): ReturnType<T> {
        const start = performance.now();
        const result = func(...args);
        const end = performance.now();
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
        }
        
        return result;
    };
};

// 🟢 Prevents too many renders by skipping some based on time
export const skipRendersByTime = (lastRenderTime: React.MutableRefObject<number>, minInterval: number = 100): boolean => {
    const now = performance.now();
    if (now - lastRenderTime.current < minInterval) {
        return true; // Skip this render
    }
    lastRenderTime.current = now;
    return false; // Don't skip
};
