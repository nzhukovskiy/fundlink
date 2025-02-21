import {Component, Input} from '@angular/core';
import {Message} from "../../../data/models/message";
import {Roles} from "../../../constants/roles";
import {LocalStorageService} from "../../../services/local-storage.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  constructor(readonly localStorageService: LocalStorageService) {
  }
  @Input() message?: Message;
  protected readonly Roles = Roles;
}
