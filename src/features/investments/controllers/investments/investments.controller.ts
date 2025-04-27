import { Body, Controller, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateFundingRoundDto } from "../../dtos/create-funding-round-dto";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { AuthGuard } from "../../../auth/guards/auth.guard";
import { RolesGuard } from "../../../auth/guards/roles.guard";
import { InvestmentService } from "../../services/investment.service";

@Controller('investments')
@ApiTags('investments')
export class InvestmentsController {
    constructor(private readonly investmentService: InvestmentService) {
    }
    @Roles('STARTUP')
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/approve')
    approveInvestment(@Param('id') id: number, @Req() req) {
        return this.investmentService.approveInvestment(id, req.token.payload.id);
    }

    @Roles('STARTUP')
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/reject')
    rejectInvestment(@Param('id') id: number, @Req() req) {
        return this.investmentService.rejectInvestment(id, req.token.payload.id);
    }
}
