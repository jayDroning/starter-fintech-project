// hooks/usePropertyState.ts
import { useState } from 'react';

type PropertyState<T> = {
  [K in keyof T]: {
    get: () => T[K];
    set: (value: T[K]) => void;
  };
};

const usePropertyState = <T extends Record<string, any>>(initialState: T): PropertyState<T> => {
  const stateEntries = Object.entries(initialState) as [keyof T, T[keyof T]][];

  const result = {} as PropertyState<T>;

  for (const [key, value] of stateEntries) {
    const [stateValue, setStateValue] = useState(value);
    result[key] = {
      get: () => stateValue,
      set: setStateValue,
    };
  }

  return result;
}

export default usePropertyState;