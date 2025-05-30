import {Startup} from "./startup";
import {ExitType} from "../../constants/exit-type";

export class Exit {
    id: number;

    date: Date;

    type: ExitType;

    value: string;

    startup: Startup;

    sharePrice: string;

    totalShares: string;

    lockupPeriodDays: number;

    constructor(id: number, date: Date, type: ExitType, value: string, startup: Startup, sharePrice: string, totalShares: string, lockupPeriodDays: number) {
        this.id = id;
        this.date = date;
        this.type = type;
        this.value = value;
        this.startup = startup;
        this.sharePrice = sharePrice;
        this.totalShares = totalShares;
        this.lockupPeriodDays = lockupPeriodDays;
    }
}
