import { produce } from 'immer'
import { ActionTypes } from './actions'
import { ICycleState } from '../../interfaces'

export function cyclesReducer(state: ICycleState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIdx = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIdx < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIdx].interruptedDate = new Date()
      })
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIdx = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIdx < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIdx].finishedDate = new Date()
      })
    }
    default:
      return state
  }
}
