import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AssignTagDto {
    @ApiProperty()
    @IsNumber()
    tagId: number;
}
