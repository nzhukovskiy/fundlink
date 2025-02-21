import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Investor } from 'src/app/data/models/investor';
import { Startup } from 'src/app/data/models/startup';
import { StartupService } from 'src/app/services/startup.service';
import {LocalStorageService} from "../../../services/local-storage.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateInvestmentComponent} from "../../dialogs/create-investment/create-investment.component";
import {Roles} from "../../../constants/roles";
import {Socket} from "ngx-socket-io";
import {AppSocketService} from "../../../services/app-socket.service";
import {CreateMessageDto} from "../../../data/dtos/create-message.dto";
import {Message} from "../../../data/models/message";
import {ChatService} from "../../../services/chat.service";
import {Chat} from "../../../data/models/chat";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-startup-page',
  templateUrl: './startup-page.component.html',
  styleUrls: ['./startup-page.component.scss']
})
export class StartupPageComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute,
              private readonly startupService: StartupService,
              readonly localStorageService: LocalStorageService,
              private readonly dialog: MatDialog,
              private socket: AppSocketService,
              private readonly chatService: ChatService,) {
  }

  startup?: Startup;
  investors?: Investor[];
  chat?: Chat;

  startupLoaded = new BehaviorSubject(false);

  ngOnInit(): void {
    this.loadStartupAndInvestors();
    this.socket.on("message", (msg: Message) => {
      this.chat?.messages.push(msg);
    })
    this.socket.emit('joinChat', {
      chatId: 1
    });
    this.chatService.getChat(1).subscribe(chat => {
      this.chat = chat;
    })
  }

  loadStartupAndInvestors() {
    this.route.paramMap.subscribe(params => {
      let id = params.get("id");
      this.startupService.getOne(parseInt(id!)).subscribe(res => {
        this.startup = res;
        this.startup.fundingRounds = this.startup.fundingRounds.sort((a,b) => a.id - b.id)
        this.startupLoaded.next(true)
      }).add(() => {});
      this.startupService.getInvestors(parseInt(id!)).subscribe(res => {
        this.investors = res;
      })
    })
  }

  openInvestmentDialog(fundingRoundId: number) {
    console.log(this.investors);
    const dialogRef = this.dialog.open(CreateInvestmentComponent, {
      data: fundingRoundId,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadStartupAndInvestors();
      }
    });
  }

  sendMessage() {
    this.socket.emit('message', {
      chatId: 1,
      text: "222222",
    } as CreateMessageDto);
  }

  protected readonly Roles = Roles;
}
