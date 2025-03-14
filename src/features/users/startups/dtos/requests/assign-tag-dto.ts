import { IsNumber } from "class-validator";

export class AssignTagDto {
    @IsNumber()
    tagId: number;
}
