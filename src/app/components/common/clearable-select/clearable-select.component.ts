import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-clearable-select',
  templateUrl: './clearable-select.component.html',
  styleUrls: ['./clearable-select.component.scss']
})
export class ClearableSelectComponent implements OnInit, OnChanges {
    selectFormControl = new FormControl('');

    @Input()
    options: {
        identifier: string,
        text: string
    }[] = []

    @Input() selectInitialValue= "";

    @Input() label?: string;

    @Output() public selectChanged = new EventEmitter<string>();

    clearSelection() {
        this.selectFormControl.setValue(null);
    }


    ngOnInit(): void {
        this.selectFormControl.setValue(this.selectInitialValue);
        this.selectFormControl.valueChanges.subscribe(value => {
            this.selectChanged.emit(value!);
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectInitialValue']) {
            this.selectFormControl.setValue(changes['selectInitialValue'].currentValue);
        }
    }
}
