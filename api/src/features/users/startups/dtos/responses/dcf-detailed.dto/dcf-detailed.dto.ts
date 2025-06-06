import { WaccDetailsDto } from "../wacc-details.dto/wacc-details.dto"

export class DcfDetailedDto {
    inputs: {
        ebitPerYear: number[];
        capitalExpenditures: number[];
        changesInWorkingCapital: number[];
        deprecationAndAmortization: number[];
        incomeTaxRate: number;
        perpetualGrowthRate: number;
        waccInputs: {
            bonds10YearsYield: number;
            beta: number;
            stockMarketAverageReturn: number;
            interestRate: number;
            debtAmount: number;
            totalInvestments: number;
        };
    };
    waccCalculation: WaccDetailsDto;
    fcfCalculations: {
        year: number;
        ebit: number;
        nopat: number; // EBIT * (1-Tax)
        fcf: number; // NOPAT + D&A - CapEx - Change NWC
        discountFactor: number; // 1 / (1+WACC)^Year
        pvFcf: number; // FCF * DiscountFactor
    }[];
    pvForecastFcfsTotal: number;
    terminalValueCalculation: {
        finalYearFcf: number;
        fcfNPlus1: number;
        terminalValueRaw: number;
        tvDiscountFactor: number;
        pvTerminalValue: number;
    };
    totalDcfValue: number;
    warnings?: number[];
}
