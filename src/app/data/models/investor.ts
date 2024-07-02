import { Investment } from "./investment";
import { User } from "./user";

export interface Investor extends User {
    name: string;

    surname: string;

    investments: Investment[];

    totalinvestment: string;
}
