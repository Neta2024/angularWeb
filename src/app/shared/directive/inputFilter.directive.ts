import { Directive, Input, HostListener,  } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[restrict]'
})
export class RestrictInputDirective {

  regexp: any;
  @Input('restrict')
  set pattern(value: any) {
    switch (value) {
      case 'formName' : this.regexp = new RegExp('[////|":?><*\\\\]', 'g'); break;
      case 't1' : break;
      default : this.regexp = new RegExp(value, 'g'); break;
    }
  }

  constructor(private control: NgControl) { }

  @HostListener('input', ['$event.target'])
  @HostListener('paste', ['$event.target'])
  public onInputEvent(input: any) {
    if (input.value) {
      const truncated = input.value.replace(this.regexp, '');
      if (truncated !== input.value && this.control.valueAccessor !== null && this.control.control  !== null) {
        this.control.valueAccessor.writeValue(truncated);
        this.control.viewToModelUpdate(truncated);
        this.control.control.setValue(truncated);
      }
    }

}
}
