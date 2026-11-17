import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle/ColorSchemeToggle';
import { INITIAL_VALUES, SAMPLE_PATIENT } from './fixtures';
import { mobilitySelectData } from './mobility';
import { type Assessment, assessmentSchema } from './schema';
import type { AssessmentFormValues } from './types';

export interface AssessmentFormProps {
  onSave?: (data: Assessment) => Promise<void> | void;
  fakeSaveDelayMs?: number;
}

export function AssessmentForm({ onSave, fakeSaveDelayMs = 800 }: AssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<Assessment | null>(null);

  const form = useForm<AssessmentFormValues>({
    mode: 'controlled',
    initialValues: INITIAL_VALUES,
    validate: schemaResolver(assessmentSchema),
    validateInputOnBlur: true,
  });

  const handleValidSubmit = async (values: AssessmentFormValues) => {
    const parsed = assessmentSchema.parse(values);
    setIsSubmitting(true);
    try {
      if (fakeSaveDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, fakeSaveDelayMs));
      }
      await onSave?.(parsed);
      setSubmittedData(parsed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadSample = () => {
    form.setValues(SAMPLE_PATIENT);
    form.clearErrors();
    setSubmittedData(null);
  };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <Group justify="space-between" align="center" mb="lg">
          <Title order={2}>Geriatric Care Assessment</Title>
          <ColorSchemeToggle />
        </Group>

        <form onSubmit={form.onSubmit(handleValidSubmit)} noValidate>
          <Stack gap="md">
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              {...form.getInputProps('mrn')}
            />

            <TextInput label="Patient name" {...form.getInputProps('patientName')} />

            <DateInput
              label="Date of birth"
              valueFormat="YYYY-MM-DD"
              clearable
              {...form.getInputProps('dateOfBirth')}
            />

            <DateInput
              label="Assessment date"
              valueFormat="YYYY-MM-DD"
              maxDate={new Date()}
              clearable
              {...form.getInputProps('assessmentDate')}
            />

            <Select
              label="Mobility"
              placeholder="Select mobility status"
              data={mobilitySelectData}
              clearable
              {...form.getInputProps('mobility')}
            />

            <NumberInput
              label="Barthel Index"
              step={5}
              min={0}
              max={100}
              clampBehavior="none"
              {...form.getInputProps('barthelIndex')}
            />

            <NumberInput
              label="Regular medications"
              min={0}
              max={30}
              clampBehavior="none"
              {...form.getInputProps('medicationCount')}
            />

            <Checkbox
              label="Pharmacist review requested"
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />

            <DateInput
              label="Next review date"
              valueFormat="YYYY-MM-DD"
              clearable
              {...form.getInputProps('followUpDate')}
            />

            <Checkbox
              label="Patient or representative has given consent"
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />

            <Group justify="space-between" mt="md">
              <Button variant="default" type="button" onClick={handleLoadSample}>
                Load sample patient
              </Button>

              <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                Save assessment
              </Button>
            </Group>
          </Stack>
        </form>

        {submittedData && (
          <Alert
            color="green"
            title="Assessment saved successfully"
            mt="lg"
            data-testid="success-alert"
          >
            <Code block data-testid="parsed-data">
              {JSON.stringify(submittedData, null, 2)}
            </Code>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
