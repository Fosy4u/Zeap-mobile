
interface IOrderHistory {
  statusHistory: StatusHistory[]
  nextStatus: NextStatus
  currentStatus: CurrentStatus
}

interface StatusHistory {
  name: string
  value: string
  percentage: number
  date: string
}

interface NextStatus {
  name: string
  value: string
  sellerAction: boolean
  percentage: number
}

interface CurrentStatus {
  name: string
  value: string
}

export type { StatusHistory, NextStatus, CurrentStatus };
export default IOrderHistory;