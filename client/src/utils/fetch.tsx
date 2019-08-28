type Options = {
  method: 'GET' | 'POST'
  credentials: RequestCredentials
  headers: HeadersInit
  body?: any
  onError?: (error: Error) => void
}

type FetchProps = {
  (url: string, options?: Partial<Options>): Promise<any>
}

const defaultOptions: Options = {
  method: 'GET',
  credentials: 'same-origin',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

const customFetch: FetchProps = async (url, options): Promise<FetchProps> => {
  const {
    method = defaultOptions.method,
    headers = defaultOptions.headers,
    credentials = defaultOptions.credentials,
    body,
    onError
  } =
    options || defaultOptions

  try {
    const response: Response = await window.fetch(url, {
      method,
      credentials,
      headers,
      body
    })

    const data = await response.json()

    return data
  } catch (error) {
    if (onError) {
      onError(error)
    } else {
      throw new Error('An error occured')
    }
  }
}

export default customFetch
