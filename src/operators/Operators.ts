import type { OperatorFunction } from "rxjs"
import { Observable } from "rxjs"

export function map<A, B>(
  cb: (a: A, index: number) => B
): OperatorFunction<A, B> {
  let index = 0

  return source =>
    new Observable(subscriber => {
      source.subscribe({
        next: value => {
          subscriber.next(cb(value, index))
          index++
        },
        complete: () => subscriber.complete(),
        error: error => subscriber.error(error)
      })

      return () => subscriber.unsubscribe()
    })
}

export function first<A>(): OperatorFunction<A, A> {
  let done = false

  return source =>
    new Observable(subscriber => {
      source.subscribe({
        next: value => {
          if (!done) {
            subscriber.next(value)
          }
          done = true
        },
        complete: () => subscriber.complete(),
        error: error => subscriber.error(error)
      })

      return () => subscriber.unsubscribe()
    })
}
