export interface FundingRoundDto {
    id: number
    startupId: number
    stage: string
    fundingGoal: string
    currentRaised: string
    startDate: Date
    endDate: Date
    isCurrent: boolean
}