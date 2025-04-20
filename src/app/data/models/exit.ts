import {Startup} from "./startup";
import {ExitType} from "../../constants/exit-type";

export class Exit {
    id: number;

    date: Date;

    type: ExitType;

    value: string;

    startup: Startup;

    constructor(id: number, date: Date, type: ExitType, value: string, startup: Startup) {
        this.id = id;
        this.date = date;
        this.type = type;
        this.value = value;
        this.startup = startup;
    }
}
