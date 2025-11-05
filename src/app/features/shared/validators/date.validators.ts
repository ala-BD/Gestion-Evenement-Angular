import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validate that the selected date is at least N days in the future
export function futureDateValidator(days: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;
    if (!raw) return null;

    const selected = new Date(raw);
    const today = new Date();
    const minDate = new Date(today.setDate(today.getDate() + days));

    if (isNaN(selected.getTime()) || selected < minDate) {
      return { futureDate: `La date doit être au moins +${days} jours à partir d'aujourd'hui.` };
    }
    return null;
  };
}


