export interface DcfDetailedDto {
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
    waccCalculation: {
        costOfEquity: number;
        costOfDebtPreTax: number;
        costOfDebtAfterTax: number;
        equityValue: number;
        debtValue: number;
        equityWeight: number;
        debtWeight: number;
        totalCapitalValue: number;
        calculatedWacc: number;
    };
    fcfCalculations: {
        year: number;
        ebit: number;
        nopat: number;
        fcf: number;
        discountFactor: number;
        pvFcf: number;
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
