import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
// NOTE:
// This shared component is used when choosing for Reactive Forms to reduce the amout of duplicate code. 
// Also it provides all kind of error messages for all kinds of behavior and it is user friendly. 
export class TextInputComponent implements OnInit, ControlValueAccessor {

  @ViewChild('input', { static: true }) input: ElementRef; // reference to the input field
  @Input() type = 'text'; // input type (password, text, date, button, ...)
  @Input() label: string; // Label that describes the input field

  // @Self() is for dipendency injection. It will only look at itself and not at other dependencies in use
  constructor(
    @Self() public controlDir: NgControl
  ) {
    // Bind the valueAccessor to this particular class, which let us access the control directive inside our component + template
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;

    // Sync validators applied on the control
    const validators = control.validator ? [control.validator] : [];

    // Async validators applied on the control
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];

    // Set Sync/Async validators on the control
    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);

    // Try to validate the from on initialization
    control.updateValueAndValidity();
  }

  onChange(event?) { }

  onTouched(event?) {}

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
