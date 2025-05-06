import { StartupNodeData } from "./startup-node-data"

export interface InvestorGraphData {
    name: string
    surname: string
    startups: Map<number, StartupNodeData>
}
