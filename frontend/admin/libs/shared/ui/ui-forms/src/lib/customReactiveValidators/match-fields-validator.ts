import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const MISMATCH_ERROR_KEY = 'fieldsMismatched' as const;

export const matchFieldsValidator = (fieldNames: string[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    if (!formGroup || fieldNames.length < 2) return null;

    const firstFieldName = fieldNames[0];
    const firstControl = formGroup.get(firstFieldName);
    const referenceValue = firstControl?.value;
    let hasError = false;

    for (let i = 1; i < fieldNames.length; i++) {
      const currentFieldName = fieldNames[i];
      const currentControl = formGroup.get(currentFieldName);

      if (currentControl) {
        if (currentControl.value !== referenceValue) {
          const currentErrors = currentControl.errors || {};
          currentControl.setErrors({ ...currentErrors, [MISMATCH_ERROR_KEY]: true });
          hasError = true;
        } else {
          if (currentControl.errors) {
            const { [MISMATCH_ERROR_KEY]: _, ...remainingErrors } = currentControl.errors;
            currentControl.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
          }
        }
      }
    }

    return hasError ? { [MISMATCH_ERROR_KEY]: true } : null;
  };
};
