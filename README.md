# Geriatric Care Assessment Form

A single-page Geriatric Care Assessment form built with **React 19**, **TypeScript**, **Mantine (v9)**, and **Zod (v4)**. Designed for visiting nurses checking on elderly patients at home.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ or v22+ (recommended)
- **Yarn 4** (configured via Corepack)

### Installation & Local Setup

```bash
# Enable Corepack (for Yarn 4)
corepack enable

# Install dependencies
yarn install

# Start local development server
yarn dev
```

### Running Tests, Typecheck & Quality Checks

The template includes a comprehensive test suite running formatting (`oxfmt`), linting (`oxlint`, `stylelint`), type checking (`tsc`), Vitest unit/component tests, and production build:

```bash
# Run all quality checks and tests
yarn test

# Run tests in watch mode
yarn vitest:watch

# Auto-fix formatting and linting
yarn check:fix
```

---

## 🛠️ Key Technical Decisions & Architecture

### 1. Schema Validation via `schemaResolver`
- Validation is handled entirely by `schemaResolver` from `@mantine/form`, backed by the Zod 4 schema in `src/features/assessment/schema.ts`.
- **Zero duplicated rules**: No validation logic (regexes, `>= 5` checks, etc.) is re-implemented inside JSX components or hand-written validate functions.
- Cross-field refinements (such as polypharmacy requiring pharmacist review and age threshold) are evaluated natively through Zod.

### 2. Type Strategy Without Hand-Written Duplication
- Per the assignment constraints, we avoid hand-writing a duplicate form interface and avoid using `any`.
- Form values are derived directly from the inferred `Assessment` type (`z.infer<typeof assessmentSchema>`) using mapped types:
  ```ts
  export type AssessmentFormValues = {
    [K in keyof Assessment]: Assessment[K] extends boolean
      ? boolean
      : Assessment[K] | '' | (Assessment[K] extends number ? string : never);
  };
  ```
- This bridges the gap between empty initial form states (empty strings `''` for inputs, `false` for consent) and the strict parsed `Assessment` output without duplicating field definitions or resorting to `any`.

### 3. Clinical Data Safety: No Silent Clamping
- When clinical staff enter scores (such as the Barthel Index or medication count), scores must **never be quietly rounded, clamped, or defaulted**.
- Both `NumberInput` fields configure `clampBehavior="none"`: typing an out-of-range value like `105` for Barthel Index retains the user's typed value in the input and allows the schema validation to explicitly display the clinical constraint error (`Barthel Index ranges from 0 to 100`).

### 4. Dynamic Mobility Options
- Select options are dynamically computed from the `MOBILITY` tuple via `formatMobilityLabel(value)`.
- Values such as `home_visit` or `cane` automatically convert to human-readable labels (`Home Visit`, `Cane`).
- Adding any new mobility status to the `MOBILITY` array immediately makes it available in the dropdown without modifying the component.

### 5. Validation on Blur & Submit
- Configured with `validateInputOnBlur: true`.
- Untouched fields stay quiet when first navigating the form.
- Blurring an invalid field triggers validation exclusively for that field.
- Submitting an empty form validates all fields and produces **exactly 9 errors** with no cross-field noise (`pharmacistReviewRequested` remains validly unchecked when medication count is not 5+).
- Submitting a valid form triggers a simulated ~800ms save state (disabling the submit button with loading spinner) and renders the Zod-parsed (trimmed) output in a Mantine `Alert` with `<Code block>`.

---

## 🧪 Test Coverage

Vitest + React Testing Library are configured in:
- `src/features/assessment/schema.test.ts`:
  - Validates the exact 60-year-old boundary on `assessmentDate` (turns 60 on visit date vs. one day short).
- `src/features/assessment/AssessmentForm.test.tsx`:
  - Tests the "Load sample patient" interaction, form submission, and asserts the save handler receives the exact parsed values.
  - Verifies that untouched fields remain quiet, blur validation triggers for individual fields, and submission renders the expected 9 required errors without spurious noise.

---

## ⏱️ Time Spent & Status

- **Time Spent**: ~1.5 hours.
- **Status**: Complete. All 10 fields, schema validation rules, blur/submit behavior, sample patient loading, test suite, and styling are fully operational and verified green under `yarn test`.

---

## 🌐 Deployment

This application can be deployed to Vercel, Netlify, or GitHub Pages.
- Build command: `yarn build`
- Output directory: `dist`
- **Live URL**: *(Deploy to Vercel/Netlify and paste URL here)*
