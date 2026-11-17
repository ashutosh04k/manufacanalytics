import { render, screen, userEvent } from '@test-utils';
import { describe, expect, it, vi } from 'vitest';
import { AssessmentForm } from './AssessmentForm';
import { SAMPLE_PATIENT } from './fixtures';

describe('AssessmentForm', () => {
  it('loads sample patient, submits, and calls save handler with parsed values', async () => {
    const handleSave = vi.fn();
    const user = userEvent.setup();

    render(<AssessmentForm onSave={handleSave} fakeSaveDelayMs={0} />);

    // Click "Load sample patient"
    const loadButton = screen.getByRole('button', { name: /load sample patient/i });
    await user.click(loadButton);

    // Verify fields are populated
    expect(screen.getByLabelText(/medical record number/i)).toHaveValue(SAMPLE_PATIENT.mrn);
    expect(screen.getByLabelText(/patient name/i)).toHaveValue(SAMPLE_PATIENT.patientName);

    // Click "Save assessment"
    const saveButton = screen.getByRole('button', { name: /save assessment/i });
    await user.click(saveButton);

    // Assert save handler was called with parsed values matching the sample patient
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(SAMPLE_PATIENT);

    // Assert success alert is displayed with parsed data
    expect(await screen.findByTestId('success-alert')).toBeInTheDocument();
  });

  it('keeps untouched fields quiet and runs validation on blur and submit', async () => {
    const handleSave = vi.fn();
    const user = userEvent.setup();

    render(<AssessmentForm onSave={handleSave} fakeSaveDelayMs={0} />);

    // 1. Initial state: untouched fields stay quiet (no error messages displayed)
    expect(screen.queryByText('Must look like MRN-004821')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Patient name must be at least 2 characters')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Date of birth is required')).not.toBeInTheDocument();

    // 2. Blur a single invalid field: validation runs for that field while untouched fields stay quiet
    const mrnInput = screen.getByLabelText(/medical record number/i);
    await user.click(mrnInput);
    await user.type(mrnInput, 'INVALID');
    await user.tab(); // trigger blur

    expect(await screen.findByText('Must look like MRN-004821')).toBeInTheDocument();
    // Untouched fields must remain quiet
    expect(
      screen.queryByText('Patient name must be at least 2 characters')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Date of birth is required')).not.toBeInTheDocument();

    // 3. Submit empty / invalid form: validation runs on submit for all fields, showing exactly 9 errors
    const saveButton = screen.getByRole('button', { name: /save assessment/i });
    await user.click(saveButton);

    expect(handleSave).not.toHaveBeenCalled();

    // Verify all 9 required field errors appear
    expect(screen.getByText('Must look like MRN-004821')).toBeInTheDocument();
    expect(screen.getByText('Patient name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
    expect(screen.getByText('Assessment date is required')).toBeInTheDocument();
    expect(screen.getByText('Select a mobility status')).toBeInTheDocument();
    expect(screen.getByText('Barthel Index score is required')).toBeInTheDocument();
    expect(screen.getByText('Enter the number of regular medications')).toBeInTheDocument();
    expect(screen.getByText('Next review date is required')).toBeInTheDocument();
    expect(
      screen.getByText('Consent must be obtained before the assessment can be saved')
    ).toBeInTheDocument();

    // Pharmacist review requested should NOT have error because medication count is empty / not >= 5
    expect(screen.queryByText(/Five or more medications is polypharmacy/)).not.toBeInTheDocument();
  });
});
