// utils/withScope.ts
export function withParamsScope<T, R>(form: T, fn: (form: T) => R): R {
    return fn(form);
  }