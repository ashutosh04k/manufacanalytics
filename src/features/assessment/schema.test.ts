import { describe, expect, it } from 'vitest';
import { assessmentSchema } from './schema';

describe('assessmentSchema validation', () => {
  const baseValidPatient = {
    mrn: 'MRN-004821',
    patientName: 'Sushila Deshpande',
    dateOfBirth: '1949-03-12',
    assessmentDate: '2026-08-07',
    mobility: 'cane' as const,
    barthelIndex: 80,
    medicationCount: 3,
    pharmacistReviewRequested: false,
    followUpDate: '2026-09-04',
    consentObtained: true as const,
  };

  it('accepts date of birth when patient is exactly 60 years old on assessment date', () => {
    const result = assessmentSchema.safeParse({
      ...baseValidPatient,
      dateOfBirth: '1966-08-07',
      assessmentDate: '2026-08-07',
    });

    expect(result.success).toBe(true);
  });

  it('rejects date of birth when patient is one day short of 60 on assessment date', () => {
    const result = assessmentSchema.safeParse({
      ...baseValidPatient,
      dateOfBirth: '1966-08-08',
      assessmentDate: '2026-08-07',
    });

    expect(result.success).toBe(false);
    const issues = !result.success ? result.error.issues : [];
    const issue = issues.find((i) => i.path.includes('dateOfBirth'));
    expect(issue).toBeDefined();
    expect(issue?.message).toBe('This pathway is for patients aged 60 and over');
  });
});
