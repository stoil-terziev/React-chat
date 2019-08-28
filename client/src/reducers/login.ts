import { Reducer } from 'react'

const types = ['SET_USERNAME', 'SET_PASSWORD', 'TOGGLE_PASS_TYPE'] as const

export type Action = {
  type: typeof types[number]
  payload?: {
    type: 'username' | 'password'
    value: string
  }
}

export type State = {
  username: string
  password: string
  passwordType: 'password' | 'text'
  hasError: boolean
}

export const initialState: State = {
  username: '',
  password: '',
  passwordType: 'password',
  hasError: false
}

const reducer: Reducer<State, Action> = (state = initialState, { type, payload }): State => {
  switch (type) {
    case 'SET_USERNAME':
    case 'SET_PASSWORD':
      return {
        ...state,
        [payload!.type]: payload!.value
      }
    case 'TOGGLE_PASS_TYPE':
      return {
        ...state,
        passwordType: state.passwordType === 'password' ? 'text' : 'password'
      }
    default:
      return state
  }
}

export default reducer
