import {Component, Input, OnInit} from '@angular/core';
import {Roles} from "../../../constants/roles";
import {LocalStorageService} from "../../../services/local-storage.service";
import {Startup} from "../../../data/models/startup";
import {Investor} from "../../../data/models/investor";
import {InvestorsService} from "../../../services/investors.service";
import {ChatService} from "../../../services/chat.service";
import {BehaviorSubject, catchError} from "rxjs";
import {Chat} from "../../../data/models/chat";
import {GetChatDTO} from "../../../data/dtos/get-chat.dto";

@Component({
  selector: 'app-goto-chat',
  templateUrl: './goto-chat.component.html',
  styleUrls: ['./goto-chat.component.scss']
})
export class GotoChatComponent implements OnInit {

  @Input()
  userToChatWith?: Startup | Investor;


  chat?: Chat;

  chatExists = false;

  paramsToPass?: GetChatDTO;

  constructor(readonly localStorageService: LocalStorageService,
              private readonly chatService: ChatService,) {

  }

  protected readonly Roles = Roles;

  ngOnInit(): void {
    console.log(this.userToChatWith);
    let user = this.localStorageService.getUser();
    if (user?.payload.role === Roles.STARTUP) {
      this.loadChatRedirectRules({startupId: user.payload.id, investorId: this.userToChatWith!.id});
    } else if (user?.payload.role === Roles.INVESTOR) {
      this.loadChatRedirectRules({startupId: this.userToChatWith!.id, investorId: user.payload.id});
    }
  }



  private loadChatRedirectRules(getChatDTO: GetChatDTO) {
    this.chatService.getChatBetweenUsers({startupId: getChatDTO.startupId, investorId: getChatDTO.investorId}).subscribe({
      next: result => {
        this.chat = result;
        this.chatExists = true;
      },
      error: error => {
        if (error.status === 404) {
          this.chatExists = false;
          this.paramsToPass = getChatDTO;
        }
      }
    })
  }
}
