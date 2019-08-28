import React, { createContext, useEffect, useReducer, Context, Reducer } from 'react'
import reducer, { initialState, State, Action } from 'reducers/user'

export type ContextType = State & {
  dispatch: (action: Action) => void
}

const initialContext: ContextType = {
  ...initialState,
  dispatch: (): void => null
}

export const UserContext: Context<ContextType> = createContext(initialContext)

const UserProvider: React.FunctionComponent = ({ children }): JSX.Element | null => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState)

  useEffect(
    () => {
      const checkLoginState = async (): Promise<void> => {
        try {
          const response: Response = await window.fetch('/isLogged', {
            credentials: 'include'
          })

          const { isLogged, user: { username, color, createdAt, lastSeen } } = await response.json()

          dispatch({
            type: 'HANDLE_LOGIN',
            payload: {
              isLogged,
              username,
              color,
              createdAt,
              lastSeen
            }
          })
        } catch (_) {
          dispatch({ type: 'HANDLE_ERROR' })
        }
      }

      checkLoginState()
    },
    [state.isLogged]
  )

  if (state.isLogged === null) {
    return null
  }

  const value: ContextType = { ...state, dispatch }

  return (
    <UserContext.Provider value={value}>
      <React.Fragment>{children}</React.Fragment>
    </UserContext.Provider>
  )
}

export default UserProvider
