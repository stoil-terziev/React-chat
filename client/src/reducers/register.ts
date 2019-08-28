import { Reducer } from 'react'

const types = [
  'SET_USERNAME',
  'SET_PASSWORD',
  'SET_PASSWORD_CONFIRM',
  'TOGGLE_PASS_TYPE',
  'HANDLE_ERROR'
] as const

export type Action = {
  type: typeof types[number]
  payload?: {
    type: 'username' | 'password' | 'confirmPassword'
    value: string
  }
}

export type State = {
  username: string
  password: string
  confirmPassword: string
  passwordType: 'password' | 'text'
  hasError: boolean
}

export const initialState: State = {
  username: '',
  password: '',
  confirmPassword: '',
  passwordType: 'password',
  hasError: false
}

const reducer: Reducer<State, Action> = (state = initialState, { type, payload }): State => {
  switch (type) {
    case 'SET_USERNAME':
    case 'SET_PASSWORD':
    case 'SET_PASSWORD_CONFIRM':
      return {
        ...state,
        [payload!.type]: payload!.value
      }
    case 'TOGGLE_PASS_TYPE':
      return {
        ...state,
        passwordType: state.passwordType === 'password' ? 'text' : 'password'
      }
    case 'HANDLE_ERROR':
      if (state.confirmPassword) {
        return {
          ...state,
          hasError: state.password !== state.confirmPassword
        }
      }

      return {
        ...state,
        hasError: false
      }
    default:
      return state
  }
}

export default reducer
