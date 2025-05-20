import { Injectable } from '@nestjs/common';
import Decimal from "decimal.js"
import { DcfDetailedDto } from "../../dtos/responses/dcf-detailed.dto/dcf-detailed.dto"
import { Startup } from "../../entities/startup.entity"
import { WaccDetailsDto } from "../../dtos/responses/wacc-details.dto/wacc-details.dto"
import { ValuationService } from "./valuation.service"

@Injectable()
export class DcfValuationService extends ValuationService {

    incomeTaxRate = "0.18"
    interestRate = "0.18"
    bonds10YearsYield = "0.16"
    beta = "1.3"
    stockMarketAverageReturn = "0.083"

    valuate(startup: Startup) {
        let dcf = new Decimal(0)
        if (
            !startup.revenuePerYear ||
            !startup.capitalExpenditures ||
            !startup.changesInWorkingCapital ||
            !startup.deprecationAndAmortization
        ) {
            return
        }
        let totalInvestments = new Decimal("0")
        startup.fundingRounds.forEach((round) => {
            totalInvestments = totalInvestments.plus(
                new Decimal(round.currentRaised)
            )
        })
        if (totalInvestments.equals(0)) {
            return dcf.toNumber()
        }
        const calculationResult: Partial<DcfDetailedDto> = {
            inputs: {
                ebitPerYear: startup.revenuePerYear.map((x) => parseFloat(x)),
                capitalExpenditures: startup.capitalExpenditures.map((x) =>
                    parseFloat(x)
                ),
                changesInWorkingCapital: startup.changesInWorkingCapital.map(
                    (x) => parseFloat(x)
                ),
                deprecationAndAmortization:
                    startup.deprecationAndAmortization.map((x) =>
                        parseFloat(x)
                    ),
                incomeTaxRate: parseFloat(this.incomeTaxRate),
                perpetualGrowthRate: 0.02,
                waccInputs: {
                    bonds10YearsYield: parseFloat(this.bonds10YearsYield),
                    beta: parseFloat(this.beta),
                    stockMarketAverageReturn: parseFloat(
                        this.stockMarketAverageReturn
                    ),
                    interestRate: parseFloat(this.interestRate),
                    debtAmount: parseFloat(startup.debtAmount),
                    totalInvestments: totalInvestments.toNumber(),
                },
            },
            fcfCalculations: [],
            warnings: [],
        }
        const waccResults = this.calculateDiscountRate(
            startup,
            totalInvestments
        )
        calculationResult.waccCalculation = waccResults
        const discountRate = new Decimal(waccResults.calculatedWacc)
        let finalYearFCF: Decimal | null = null
        startup.revenuePerYear.forEach((revenue, i) => {
            const nopat = new Decimal(revenue).mul(
                new Decimal("1").minus(new Decimal(this.incomeTaxRate))
            )
            const fcf = nopat
                .plus(new Decimal(startup.deprecationAndAmortization[i]))
                .minus(new Decimal(startup.capitalExpenditures[i]))
                .minus(new Decimal(startup.changesInWorkingCapital[i]))

            if (i === startup.revenuePerYear.length - 1) {
                finalYearFCF = fcf
            }
            const discountFactor = new Decimal(1).plus(discountRate).pow(i + 1)
            const pvFcf = fcf.div(discountFactor)
            dcf = dcf.plus(pvFcf)

            calculationResult.fcfCalculations.push({
                year: i + 1,
                ebit: parseInt(revenue),
                nopat: nopat.toNumber(),
                fcf: fcf.toNumber(),
                discountFactor: discountFactor.toNumber(),
                pvFcf: pvFcf.toNumber(),
            })
        })

        calculationResult.pvForecastFcfsTotal = dcf.toNumber()
        const g = new Decimal(0.02)

        const fcfNPlus1 = finalYearFCF.mul(new Decimal(1).plus(g))

        const tvDenominator = discountRate.minus(g)
        if (tvDenominator.isZero() || tvDenominator.isNegative()) {

            return null
        }
        const terminalValue = fcfNPlus1.div(tvDenominator)

        const tvDiscountFactor = new Decimal(1)
            .plus(discountRate)
            .pow(startup.deprecationAndAmortization.length)

        if (tvDiscountFactor.isZero()) {
            return null
        }
        const pvTerminalValue = terminalValue.div(tvDiscountFactor)
        const terminalValueRaw = fcfNPlus1.div(tvDenominator)
        calculationResult.terminalValueCalculation = {
            finalYearFcf: finalYearFCF.toNumber(),
            fcfNPlus1: fcfNPlus1.toNumber(),
            terminalValueRaw: terminalValueRaw.toNumber(),
            tvDiscountFactor: new Decimal(1).div(tvDiscountFactor).toNumber(),
            pvTerminalValue: pvTerminalValue.toNumber(),
        }
        calculationResult.totalDcfValue = dcf.plus(pvTerminalValue).toNumber()
        return calculationResult
    }


    private calculateDiscountRate(startup: Startup, totalInvestments: Decimal) {
        const waccResult: Partial<WaccDetailsDto> = {}
        const v = totalInvestments.plus(new Decimal(startup.debtAmount))
        const costOfEquity = new Decimal(this.bonds10YearsYield).plus(
            new Decimal(this.beta).mul(
                new Decimal(this.stockMarketAverageReturn).minus(
                    new Decimal(this.bonds10YearsYield)
                )
            )
        )
        waccResult.costOfEquity = costOfEquity.toNumber()
        const e = totalInvestments.div(v)
        waccResult.costOfDebtPreTax = parseFloat(this.interestRate)
        const kd = new Decimal(this.interestRate).mul(
            new Decimal(1).minus(new Decimal(this.incomeTaxRate))
        )
        waccResult.costOfDebtAfterTax = kd.toNumber()
        waccResult.equityValue = totalInvestments.toNumber()
        waccResult.debtValue = parseFloat(startup.debtAmount)
        waccResult.equityWeight = e.toNumber()
        const d = new Decimal(startup.debtAmount).div(v)
        waccResult.debtWeight = d.toNumber()
        waccResult.totalCapitalValue = v.toNumber()
        const result = e
            .mul(costOfEquity)
            .plus(
                d
                    .mul(new Decimal(this.interestRate))
                    .mul(new Decimal(1).minus(new Decimal(this.incomeTaxRate)))
            )
        waccResult.calculatedWacc = result.toNumber()
        return {
            costOfEquity: costOfEquity.toNumber(),
            costOfDebtPreTax: parseFloat(this.interestRate),
            costOfDebtAfterTax: kd.toNumber(),
            equityValue: totalInvestments.toNumber(),
            debtValue: parseFloat(startup.debtAmount),
            equityWeight: e.toNumber(),
            debtWeight: d.toNumber(),
            totalCapitalValue: v.toNumber(),
            calculatedWacc: result.toNumber(),
        } as WaccDetailsDto
    }
}
