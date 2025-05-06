import { InvestmentDetail } from "./investment-detail"

export interface InvestorNodeData {
    name: string
    surname: string
    investments: InvestmentDetail[]
    weight?: number
}
