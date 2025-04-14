import { useState } from 'react';

// Define a generic type for form fields, so it can be used across different forms
export type FormFields<T> = {
  [K in keyof T]: T[K];
};

// Define the shape of the field configuration
export type FieldConfig<T> = {
  name: keyof T;
  initialValue: T[keyof T];
};

// Generalized hook for dynamic forms
export const useDynamicForm = <T>(config: FieldConfig<T>[]) => {
  const [formState, setFormState] = useState<FormFields<T>>(() =>
    config.reduce((acc, { name, initialValue }) => {
      acc[name] = initialValue;
      return acc;
    }, {} as FormFields<T>)
  );

  const setField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  return {
    formState,
    setField,
  };
};