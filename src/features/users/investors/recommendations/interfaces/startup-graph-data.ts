import { InvestorNodeData } from "./investor-node-data"

export interface StartupGraphData {
    title: string
    description: string
    investors: Map<number, InvestorNodeData>
}
