import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-send-message',
    templateUrl: './send-message.component.html',
    styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent {
    @Output() public message = new EventEmitter<string>();

    constructor() {
    }

    messageFormControl = new FormControl('');

    sendMessage() {
        this.message.emit(this.messageFormControl.value!);
        this.messageFormControl.setValue(null);
    }
}
