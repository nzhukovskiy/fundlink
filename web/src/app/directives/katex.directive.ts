import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import * as katex from 'katex';

@Directive({
  selector: '[appKatex]'
})
export class KatexDirective implements OnChanges {

    @Input() appKatex!: string;

    constructor(private el: ElementRef) {}

    ngOnChanges() {
        if (this.appKatex) {
            this.el.nativeElement.innerHTML = '';

            katex.render(this.appKatex, this.el.nativeElement, {
                throwOnError: false,
                displayMode: true,
                output: "mathml"
            });
        }
    }

}
