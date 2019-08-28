import { errorObject } from 'types'

const ErrorHandler = (port: number) => (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const errors: errorObject = {
    eacces: `Port ${port} requires elevated privileges`,
    eaddrinuse: `Port ${port} is already in use`
  }

  if ((Object.keys(errors) as string[]).includes((error.code as string).toLowerCase())) {
    process.exit(1)
  }

  throw error
}

export default ErrorHandler
