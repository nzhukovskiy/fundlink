import { AbstractControl, FormGroup, FormArray } from '@angular/forms';

export function markAllControlsAsTouched(control: AbstractControl): void {
    if (control instanceof FormGroup || control instanceof FormArray) {
        Object.values(control.controls).forEach(ctrl => markAllControlsAsTouched(ctrl));
    }
    control.markAsTouched();
}


export function showErrors(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
}
