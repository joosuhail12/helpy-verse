
import * as React from 'react';

type LazyComponentModule<T> = () => Promise<{ default: React.ComponentType<T> }>;

export function lazily<T extends Record<string, React.ComponentType<any>>>(
  importFn: () => Promise<T>
): { [K in keyof T]: React.LazyExoticComponent<T[K]> } {
  const result: any = {};
  
  return new Proxy(result, {
    get: (_, componentName: string) => {
      if (!result[componentName]) {
        result[componentName] = React.lazy(async () => {
          const module = await importFn();
          return { default: module[componentName] };
        });
      }
      return result[componentName];
    }
  });
}
