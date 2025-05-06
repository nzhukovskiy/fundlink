import { FundingRoundDto } from "./funding-round.dto"

export interface RecommendedStartupDto {
    id: number
    title: string
    description: string
    fundingRounds?: FundingRoundDto[]
}