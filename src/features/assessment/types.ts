import type { Assessment } from './schema';

export type AssessmentFormValues = {
  [K in keyof Assessment]: Assessment[K] extends boolean
    ? boolean
    : Assessment[K] | '' | (Assessment[K] extends number ? string : never);
};
