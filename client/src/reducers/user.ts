import { Reducer } from 'react'

const types = [
  'SET_LOGIN_STATE',
  'HANDLE_LOGIN',
  'HANDLE_ERROR'
] as const

export type Action = {
  type: typeof types[number]
  payload?: any
}

export type State = User & {
  isLogged: boolean
}

export const initialState: State = {
  username: '',
  color: '',
  isLogged: null,
  createdAt: 0,
  lastSeen: 0
}

const reducer: Reducer<State, Action> = (state = initialState, { type, payload }): State => {
  switch (type) {
    case 'SET_LOGIN_STATE':
      return {
        ...state,
        isLogged: payload
      }
    case 'HANDLE_LOGIN':
      return { ...payload }
    case 'HANDLE_ERROR':
      return {
        ...initialState,
        isLogged: false
      }
    default:
      return state
  }
}

export default reducer
