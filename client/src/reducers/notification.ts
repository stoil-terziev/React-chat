import { Reducer } from 'react'

type Message = {
  type: 'success' | 'error'
  text: string
}

const types = [
  'SET_NOTIFICATION',
  'TOGGLE_NOTIFICATION',
  'HIDE_NOTIFICATION',
  'SET_QUE',
  'CLEAR_QUE',
  'HANDLE_ERROR'
] as const

type ActionTypes = typeof types[number]

export type Action = {
  type: ActionTypes
  payload?: any
}

export type State = {
  isOpen: boolean
  que?: Message | null
  notification: Message
}

export const initialState: State = {
  isOpen: false,
  que: null,
  notification: {
    type: 'success',
    text: ''
  }
}

const reducer: Reducer<State, Action> = (state = initialState, { type, payload }): State => {
  switch (type) {
    case 'SET_NOTIFICATION':
      if (state.isOpen) {
        return {
          ...state,
          que: payload,
          isOpen: false
        }
      }
      return {
        ...state,
        isOpen: true,
        notification: payload
      }
    case 'TOGGLE_NOTIFICATION':
      return {
        ...state,
        isOpen: !state.isOpen
      }
    case 'HIDE_NOTIFICATION':
      return {
        ...state,
        isOpen: false
      }
    case 'SET_QUE':
      return {
        ...state,
        que: payload
      }
    case 'CLEAR_QUE':
      if (state.que) {
        return {
          isOpen: true,
          notification: state.que,
          que: null
        }
      }

      return {
        isOpen: false,
        que: null,
        notification: {
          type: 'success',
          text: ''
        }
      }

    case 'HANDLE_ERROR':
      const message: Message = {
        type: 'error',
        text: 'Something went wrong. Please try again'
      }
      if (state.isOpen) {
        return {
          ...state,
          que: message,
          isOpen: false
        }
      }
      return {
        ...state,
        isOpen: true,
        notification: message
      }

    default:
      return state
  }
}

export default reducer
