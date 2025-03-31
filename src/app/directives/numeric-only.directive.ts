import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appNumericOnly]',
})
export class NumericOnlyDirective {

    private regex: RegExp = new RegExp(/^[0-9]*$/g);

    constructor(private el: ElementRef) {
    }

    @HostListener('input', ['$event']) onInputChange(event: InputEvent) {
        const input = this.el.nativeElement;
        const inputValue = input.value;
        if (!this.regex.test(inputValue)) {
            input.value = inputValue.replace(/[^0-9]/g, '');
        }
        event.stopPropagation();
    }

}
