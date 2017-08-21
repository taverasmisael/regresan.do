import { FormControl } from '@angular/forms'
import { ValidationResult } from '@models/validationresult'

export class DateValidator {
  static spanishDate(control: FormControl): ValidationResult {
    let datePattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/

    if (!control.value.match(datePattern)) {
      return { date: true }
    }

    return null
  }
}
