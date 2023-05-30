import { ReactNode } from 'react'

export interface ICreateCycleData {
  task: string
  minutesAmount: number
}

export interface ICycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export interface ICycleState {
  cycles: ICycle[]
  activeCycleId: string | null
}

export interface ICyclesContextData {
  cycles: ICycle[]
  activeCycle: ICycle | undefined
  activeCycleId: string | null
  amountSeconsPassed: number
  makrCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: ICreateCycleData) => void
  interruptCurrentCycle: () => void
}

export interface ICyclesContextProviderProps {
  children: ReactNode
}
