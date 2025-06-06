import {Startup} from "./startup";
import {Investor} from "./investor";
import {Message} from "./message";

export class Chat {
  id: number;

  startup: Startup;

  investor: Investor;

  messages: Message[];

  constructor(id: number, startup: Startup, investor: Investor, messages: Message[]) {
    this.id = id;
    this.startup = startup;
    this.investor = investor;
    this.messages = messages;
  }
}
