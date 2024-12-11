import { Investment } from "./investment";
import { User } from "./user";

export class Investor extends User {
    name: string;

    surname: string;

    investments: Investment[];

    totalInvestment: string;

    constructor(
        id: number, email: string, password: string, name: string, surname: string, investments: Investment[], totalinvestment: string
    ) {
        super(id, email, password);
        this.name = name;
        this.surname = surname;
        this.investments = investments;
        this.totalInvestment = totalinvestment;
    }
}
