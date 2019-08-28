import { Reducer } from 'react'

const types = [
  'FOCUS_CHANGE',
  'RESET_MESSAGE',
  'SET_MESSAGE',
  'NEW_MESSAGE',
  'FETCH_MESSAGES',
  'SET_MESSAGES',
  'SET_PLACEHOLDER'
] as const

export type Action = {
  type: typeof types[number]
  payload?: any
}

export type State = {
  isLoading: boolean
  placeholder: string
  message: string
  messages: Messages[]
}

export const initialState: State = {
  isLoading: true,
  placeholder: '',
  message: '',
  messages: []
}

const reducer: Reducer<State, Action> = (state = initialState, { type, payload }): State => {
  switch (type) {
    case 'FOCUS_CHANGE':
      return {
        ...state,
        placeholder: payload
      }
    case 'RESET_MESSAGE':
      return {
        ...state,
        message: ''
      }
    case 'SET_MESSAGE':
      return {
        ...state,
        message: payload
      }
    case 'SET_MESSAGES':
      const prevMessages = state.messages
      const foundMessage: Message = prevMessages.find(prevMessage => prevMessage.id === payload.id) as Message

      if (foundMessage) {
        foundMessage.sent = true
      } else {
        prevMessages.push(payload)
      }

      return {
        ...state,
        messages: prevMessages
      }
    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, payload]
      }
    case 'FETCH_MESSAGES':
      return {
        ...state,
        isLoading: false,
        messages: [...state.messages, ...payload]
      }
    case 'SET_PLACEHOLDER':
      return {
        ...state,
        placeholder: payload
      }
    default:
      return state
  }
}

export default reducer
