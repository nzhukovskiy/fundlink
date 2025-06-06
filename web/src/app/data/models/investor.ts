import { Investment } from "./investment";
import { User } from "./user";

export class Investor extends User {
    name: string;

    surname: string;

    title: string;

    location: string;

    description: string;

    investments: Investment[];

    totalInvestment: string;

    constructor(id: number, email: string, password: string, name: string, surname: string, title: string, location: string, description: string, investments: Investment[], totalInvestment: string) {
        super(id, email, password);
        this.name = name;
        this.surname = surname;
        this.title = title;
        this.location = location;
        this.description = description;
        this.investments = investments;
        this.totalInvestment = totalInvestment;
    }
}
