import { FormGroup } from '@angular/forms';

export function NotEmptyTitleOrDesc() {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls.title;
    const matchingControl = formGroup.controls.description;

    if (matchingControl.errors && !matchingControl.errors.notEmpty) {
      return;
    }

    if (control.value === '' && matchingControl.value === '') {
      control.setErrors({ notEmpty: true });
    } else {
      control.setErrors(null);
    }
  };
}
