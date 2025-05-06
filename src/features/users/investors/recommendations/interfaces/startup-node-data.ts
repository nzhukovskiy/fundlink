import { InvestmentDetail } from "./investment-detail"

export interface StartupNodeData {
    title: string
    description: string
    investments: InvestmentDetail[]
    weight?: number
}
