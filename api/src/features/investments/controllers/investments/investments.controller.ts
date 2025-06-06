import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { Roles } from "../../../auth/decorators/roles.decorator"
import { AuthGuard } from "../../../auth/guards/auth.guard"
import { RolesGuard } from "../../../auth/guards/roles.guard"
import { InvestmentService } from "../../services/investment.service"

@Controller('investments')
@ApiTags('investments')
export class InvestmentsController {
    constructor(private readonly investmentService: InvestmentService) {
    }

    @ApiBearerAuth()
    @Roles('STARTUP')
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/approve')
    approveInvestment(@Param('id') id: number, @Req() req) {
        return this.investmentService.approveInvestment(id, req.token.payload.id);
    }

    @ApiBearerAuth()
    @Roles('STARTUP')
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/reject')
    rejectInvestment(@Param('id') id: number, @Req() req) {
        return this.investmentService.rejectInvestment(id, req.token.payload.id);
    }
}
