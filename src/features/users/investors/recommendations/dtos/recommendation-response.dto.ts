import { RecommendedStartupDto } from "./recommended-startup.dto"

export interface RecommendationResponseDto {
    startupWeights: Record<number, number>
    recommendedStartups: RecommendedStartupDto[]
}