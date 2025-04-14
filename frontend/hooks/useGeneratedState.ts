import { useState } from 'react';

type CapitalizeKey<K> = K extends string ? `set${Capitalize<K>}` : never;

type UseGeneratedStateResult<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
} & {
  [K in keyof T as CapitalizeKey<K>]: (val: T[K]) => void;
} & {
  toJSON: () => T;
  reset: () => void;
};

export function useGeneratedState<T extends Record<string, any>>(initial: T): UseGeneratedStateResult<T> {
  const state = {} as Record<string, any>;
  const setFns: Record<string, any> = {};
  const initialValues = { ...initial };

  for (const key in initial) {
    const [value, setValue] = useState(initial[key]);
    state[key] = value;
    setFns[`set${capitalize(key)}`] = setValue;
  }

  const result = {
    ...state,
    ...setFns,
    toJSON: () => {
      const snapshot = {} as T;
      for (const key in initial) {
        snapshot[key] = state[key];
      }
      return snapshot;
    },
    reset: () => {
      for (const key in initial) {
        const setter = setFns[`set${capitalize(key)}`];
        setter?.(initial[key]);
      }
    },
  };

  return result as UseGeneratedStateResult<T>;
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}