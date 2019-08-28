import React, { createContext, useReducer, Context, Reducer } from 'react'
import reducer, { initialState, State, Action } from 'reducers/notification'
import Notification from 'components/Notification'

type ContextType = (action: Action) => void
const initialContext: ContextType = () => null
export const NotificationContext: Context<ContextType> = createContext(initialContext)

const NotificationProvider: React.FunctionComponent = ({ children }): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState)

  const handleExited = (): void => dispatch({ type: 'CLEAR_QUE' })
  const handleClose = (_: React.MouseEvent<HTMLElement>, reason: string): void => {
    if (reason === 'clickaway') {
      return
    }

    dispatch({ type: 'HIDE_NOTIFICATION' })
  }

  return (
    <NotificationContext.Provider value={dispatch}>
      <Notification
        variant={state.notification.type}
        message={state.notification.text}
        isOpen={state.isOpen}
        onClose={handleClose}
        onExited={handleExited}
      />
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
