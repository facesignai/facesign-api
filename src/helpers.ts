import { ClientErrorCode } from './errors'

export const rejectAfterTimeout = <T>(
  promise: Promise<T>,
  timeoutMS: number
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(ClientErrorCode.RequestTimeout)
    }, timeoutMS)

    promise
      .then(resolve)
      .catch(reject)
      .then(() => clearTimeout(timeoutId))
  })
}
