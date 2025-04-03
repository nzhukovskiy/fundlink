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
            // Clear the existing content
            this.el.nativeElement.innerHTML = '';

            // Render the LaTeX
            katex.render(this.appKatex, this.el.nativeElement, {
                throwOnError: false,
                displayMode: true,
                output: "mathml" // This forces only MathML output
            });
        }
    }

}
