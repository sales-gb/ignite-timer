import differenceInSeconds from 'date-fns/differenceInSeconds'
import { createContext, useEffect, useReducer, useState } from 'react'
import { cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import {
  ICreateCycleData,
  ICycle,
  ICyclesContextData,
  ICyclesContextProviderProps,
} from '../interfaces'

export const CyclesContext = createContext({} as ICyclesContextData)

export function CyclesContextProvider({
  children,
}: ICyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storageStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )
      if (storageStateAsJSON) {
        return JSON.parse(storageStateAsJSON)
      }

      return initialState
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSeconsPassed, setAmountSeconsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSeconsPassed(seconds)
  }

  function makrCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: ICreateCycleData) {
    const id: string = String(new Date().getTime())

    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSeconsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        makrCurrentCycleAsFinished,
        amountSeconsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
